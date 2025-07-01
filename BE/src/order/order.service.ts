import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CryptoService } from '../crypto/crypto.service';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import { RedisService } from '@/redis/redis.service';
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as Handlebars from 'handlebars';
import * as pdf from 'html-pdf-node';
import { falcon } from 'falcon-crypto';

import { FalconKeyService } from '@/falcon/falcon.service';
import { S3Service } from '@/s3/s3.service';
@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private cryptoService: CryptoService,
    private falconKeyService: FalconKeyService,
    private s3Service: S3Service,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createOrder(order: CreateOrderDto, userId: string) {
    const orderData = order.data;
    const orderDetails: {
      productId: string;
      quantity: number;
      price: number;
      subtotal: number;
      seller: string;
    }[] = [];

    for (const item of orderData.items) {
      const product = await this.prisma.product.findUnique({
        where: { productId: item.productId },
      });
      if (!product) continue;

      const price = product.price;
      const subtotal = price * item.quantity;

      orderDetails.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        subtotal,
        seller: product.sellerId,
      });
    }

    if (orderDetails.length === 0) {
      throw new BadRequestException('No valid products found in the order');
    }

    const sellerGroupedDetails = orderDetails.reduce((acc, item) => {
      const key = item.seller;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});

    for (const seller in sellerGroupedDetails) {
      if (sellerGroupedDetails.hasOwnProperty(seller)) {
        const data = await this.prisma.order.create({
          data: {
            userId,
            sellerId: seller,
            fullName: this.cryptoService.encrypt(orderData.fullName),
            phone: this.cryptoService.encrypt(orderData.phone),
            email: orderData.email
              ? this.cryptoService.encrypt(orderData.email)
              : null,
            address: this.cryptoService.encrypt(orderData.address),
            total: sellerGroupedDetails[seller].reduce(
              (sum, item) => sum + item.subtotal,
              0,
            ),
            orderDetails: {
              create: sellerGroupedDetails[seller].map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.subtotal,
              })),
            },
            OrderSignature: {
              create: {
                signature: order.signature,
              },
            },
            payment: {
              create: {
                paymentId: uuidv4(),
                method: 'COD',
                status: 'PENDING',
                amount: sellerGroupedDetails[seller].reduce(
                  (sum, item) => sum + item.subtotal,
                  0,
                ),
              },
            },
          },
        })
        console.log(data)
      }
    }

    return {
      message: "Order created successfully",
    }
  }

  async getSellerOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { sellerId: userId },
      orderBy: { orderDate: 'desc' },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            userId: true,
            username: true,
          }
        },
      }
    })

    return orders.map((order) => {
      order.fullName = this.cryptoService.decrypt(order.fullName);
      order.phone = this.cryptoService.decrypt(order.phone);
      if (order.email) order.email = this.cryptoService.decrypt(order.email);
      order.address = this.cryptoService.decrypt(order.address);

      return order;
    });
  }

  async getOrderIntent(orderId: string, userId: string) {
    const orderIntent = await this.redisService.get(`order_intent:${orderId}`);
    if (!orderIntent) {
      throw new BadRequestException('Order intent not found or expired');
    }
    const parsedIntent = JSON.parse(orderIntent);
    if (userId !== parsedIntent.userId) {
      throw new BadRequestException(
        'You do not have permission to access this order',
      );
    }
    return {
      orderId: parsedIntent.orderId,
      orderDetails: parsedIntent.orderDetails,
      billingDetails: {
        fullName: this.cryptoService.encrypt(parsedIntent.fullName),
        phone: this.cryptoService.encrypt(parsedIntent.phone),
        email: this.cryptoService.encrypt(parsedIntent.email) || '',
        address: this.cryptoService.encrypt(parsedIntent.address),
      },
      amount: parsedIntent.orderDetails.reduce(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (sum, item) => sum + item.subtotal,
        0,
      ),
      clientSecret: parsedIntent.clientSecret,
    };
  }

  // async createPayment(createOrderDto: CreateOrderDto, userId: string) {
  //   const orderDetails: {
  //     productId: string;
  //     productName?: string;
  //     coverImage?: string | null;
  //     quantity: number;
  //     price: number;
  //     subtotal: number;
  //   }[] = [];

  //   for (const item of createOrderDto.items) {
  //     const product = await this.prisma.product.findUnique({
  //       where: { productId: item.productId },
  //     });
  //     if (!product) continue;

  //     const price = product.price;
  //     const subtotal = price * item.quantity;

  //     orderDetails.push({
  //       productId: item.productId,
  //       productName: product.name,
  //       coverImage: product.coverImage,
  //       quantity: item.quantity,
  //       price,
  //       subtotal,
  //     });
  //   }

  //   if (orderDetails.length === 0) {
  //     throw new BadRequestException('No valid products found in the order');
  //   }

  //   const total = orderDetails.reduce((sum, item) => sum + item.subtotal, 0);

  //   // Nếu phương thức thanh toán là COD, không cần tạo PaymentIntent
  //   if (createOrderDto.paymentMethod == 'cod') {
  //     return this.create(
  //       userId,
  //       undefined,
  //       orderDetails.map((item) => ({
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         price: item.price,
  //         subtotal: item.subtotal,
  //       })),
  //       'cod',
  //       {
  //         fullName: createOrderDto.fullName,
  //         phone: createOrderDto.phone,
  //         email: createOrderDto.email || '',
  //         address: createOrderDto.address,
  //       },
  //     );
  //   }

  //   // Tạo PaymentIntent với Stripe
  //   const orderId = uuidv4();
  //   const paymentIntent = await this.stripe.paymentIntents.create({
  //     amount: total,
  //     currency: 'vnd',
  //     metadata: {
  //       userId,
  //       orderId,
  //     },
  //     automatic_payment_methods: { enabled: true },
  //   });

  //   this.redisService.set(
  //     `order_intent:${orderId}`,
  //     JSON.stringify({
  //       userId,
  //       orderId,
  //       orderDetails,
  //       billingDetails: {
  //         fullName: createOrderDto.fullName,
  //         phone: createOrderDto.phone,
  //         email: createOrderDto.email || '',
  //         address: createOrderDto.address,
  //       },
  //       paymentMethod: createOrderDto.paymentMethod,
  //       clientSecret: paymentIntent.client_secret,
  //     }),
  //     'EX',
  //     60 * 60 * 24, // 24 hours,
  //   );

  //   return {
  //     orderId,
  //   };
  // }

  // async handlePaymentWebhook(signature: string, body: any) {
  //   let event: Stripe.Event;

  //   if (!signature) {
  //     throw new BadRequestException('Missing Stripe signature');
  //   }
  //   if (process.env.STRIPE_ENDPOINT_SECRET === undefined) {
  //     throw new Error('No Stripe webhook secret configured');
  //   }

  //   try {
  //     event = this.stripe.webhooks.constructEvent(
  //       body,
  //       signature,
  //       process.env.STRIPE_ENDPOINT_SECRET || '',
  //     );
  //   } catch (error) {
  //     console.error('Error handling payment webhook:', error);
  //     throw new BadRequestException('Something went wrong');
  //   }
  //   const data = event.data.object as Stripe.PaymentIntent;
  //   const { orderId } = data.metadata;
  //   const paymentIntentCache = await this.redisService.get(
  //     `order_intent:${orderId}`,
  //   );
  //   if (!paymentIntentCache) return;
  //   const parsedIntent = JSON.parse(paymentIntentCache);
  //   const { userId, orderDetails, billingDetails, paymentMethod } =
  //     parsedIntent;
  //   this.create(
  //     userId,
  //     orderId,
  //     orderDetails.map((item) => ({
  //       productId: item.productId,
  //       quantity: item.quantity,
  //       price: item.price,
  //       subtotal: item.subtotal,
  //     })),
  //     paymentMethod,
  //     billingDetails,
  //     data.id,
  //   );
  //   return 'succes! thank you';
  // }

  async create(
    userId: string,
    sellerId: string,
    orderId: string = uuidv4(),
    orderDetails: {
      productId: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[],
    paymentMethod: 'cod' | 'card',
    paymentDetails: {
      fullName: string;
      phone: string;
      email?: string;
      address: string;
    },
    paymentId?: string,
  ) {
    if (orderDetails.length === 0) {
      throw new Error('No valid products found in the order');
    }

    const total = orderDetails.reduce((sum, item) => sum + item.subtotal, 0);

    const data = await this.prisma.order.create({
      data: {
        orderId,
        userId,
        sellerId,
        fullName: this.cryptoService.encrypt(paymentDetails.fullName),
        phone: this.cryptoService.encrypt(paymentDetails.phone),
        email: paymentDetails.email
          ? this.cryptoService.encrypt(paymentDetails.email)
          : null,
        address: this.cryptoService.encrypt(paymentDetails.address),
        total,
        orderDetails: {
          create: orderDetails,
        },
        payment: {
          create: {
            paymentId: paymentId || uuidv4(),
            method: paymentMethod.toUpperCase() as 'CARD' | 'COD',
            status: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
            amount: total,
          },
        },
      },
      include: {
        orderDetails: true,
        payment: true,
      },
    });
    //tạo hoá đơn

    this.generatePayment(orderId);

    (data.payment as { orderId?: string }).orderId = undefined;

    data.fullName = this.cryptoService.decrypt(data.fullName);
    data.phone = this.cryptoService.decrypt(data.phone);
    if (data.email) data.email = this.cryptoService.decrypt(data.email);
    data.address = this.cryptoService.decrypt(data.address);

    data.orderDetails.map((order) => {
      (order as { orderId?: string }).orderId = undefined;
    });

    return data;
  }

  async findAll(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      orderBy: { orderDate: 'desc' },
      include: {
        orderDetails: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    return orders.map((order) => {
      order.fullName = this.cryptoService.decrypt(order.fullName);
      order.phone = this.cryptoService.decrypt(order.phone);
      if (order.email) order.email = this.cryptoService.decrypt(order.email);
      order.address = this.cryptoService.decrypt(order.address);

      (order.payment as { cardExpiryDate?: string }).cardExpiryDate = undefined;
      (order.payment as { cardHolderName?: string }).cardHolderName = undefined;
      (order.payment as { orderId?: string }).orderId = undefined;

      return order;
    });
  }

  async findOne(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId, userId },
    });
    if (!order) throw new BadRequestException('Order not found');

    order.fullName = this.cryptoService.decrypt(order.fullName);
    order.phone = this.cryptoService.decrypt(order.phone);
    order.email = order.email ? this.cryptoService.decrypt(order.email) : '';
    order.address = this.cryptoService.decrypt(order.address);

    return order;
  }

  async getInvoice(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId, userId },
      include: {
        invoiceSignature: true,
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const fileName = `invoice_${order.orderId}.pdf`;
    const fileUrl = await this.s3Service.generatePresignedUrl(
      process.env.S3_BUCKET_NAME || '',
      fileName,
    );

    return {
      orderId: order.orderId,
      invoiceUrl: fileUrl,
      signature: order.invoiceSignature?.signature,
    };
  }

  parseExpiryDate(expiry?: string): Date | undefined {
    if (!expiry) return undefined;
    const [month, year] = expiry.split('/');
    if (!month || !year || isNaN(+month) || isNaN(+year)) return undefined;

    const fullYear =
      year.length === 2 ? parseInt('20' + year, 10) : parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) return undefined;

    return new Date(fullYear, monthNum, 0);
  }

  async generatePayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderId: orderId },
      include: {
        payment: true,
        orderDetails: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new Error('Unable to find order');
    }

    // Creating the PDF invoice
    const htmlData = {
      name: this.cryptoService.decrypt(order.fullName),
      phone: this.cryptoService.decrypt(order.phone),
      address: this.cryptoService.decrypt(order.address),
      date: new Date(order.orderDate).toLocaleString(),
      orderId: order.orderId,
      total: order.total.toLocaleString('vi-VN'),
      paymentId: order.payment?.paymentId,
      items: order.orderDetails.map((item, index) => ({
        index: index + 1,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price.toLocaleString('vi-VN'),
        subtotal: item.subtotal.toLocaleString('vi-VN'),
      })),
      user: order.user.username,
    };

    const templatePath = path.join(
      process.cwd(),
      'src',
      'order',
      'invoice.hbs',
    );
    const templateHtml = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = Handlebars.compile(templateHtml);
    const htmlContent = compiledTemplate(htmlData);

    const fileDir = path.join(__dirname, '.tmp');
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);

    const fileName = `invoice_${order.orderId}.pdf`;
    const filePath = path.join(__dirname, '.tmp', fileName);

    const file = { content: htmlContent };
    const buffer = await pdf.generatePdf(file, { preferCSSPageSize: true });
    fs.writeFileSync(filePath, buffer);

    // Sign the PDF with Falcon
    const signature = await falcon.signDetached(
      buffer,
      this.falconKeyService.privateKey,
    );

    await this.prisma.invoiceSignature.create({
      data: {
        orderId: order.orderId,
        signature: Buffer.from(signature).toString('base64'),
      },
    });

    // Save the signed PDF to S3 or local storage
    await this.s3Service.uploadFile(
      process.env.S3_BUCKET_NAME || '',
      filePath,
      fileName,
    );
    console.log('Invoice generated and uploaded successfully');
    return true;
  }
}
