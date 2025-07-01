import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { CryptoService } from '@/crypto/crypto.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService
  ) {}

  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { productId: id },
      include: {
        seller: {
          select: {
            userId: true,
            fullname: true,
          },
        },
      }
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    product.seller.fullname = this.cryptoService.decrypt(product.seller.fullname);
    return product;
  }

  async createProduct(userId: string, productData: ProductDto) {
    return this.prisma.product.create({
      data: {
        ...productData,
        sellerId: userId,
      },
    });
  }

  async getMyProducts(userId: string) {
    return this.prisma.product.findMany({
      where: { sellerId: userId },
    });
  }

  async updateProduct(userId: string, id: string, productData: ProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        productId: id,
        sellerId: userId,
      },
    });
    if (!existingProduct) {
      throw new BadRequestException('Product not found or you do not have permission to update it.');
    }

    return this.prisma.product.update({
      where: {
        productId: id,
      },
      data: productData,
    });
  }
}
