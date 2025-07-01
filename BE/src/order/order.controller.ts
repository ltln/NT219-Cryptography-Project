import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '@/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // @Post()
  // @UseGuards(JwtAuthGuard)
  // create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
  //   console.log(createOrderDto);
  //   return this.orderService.create(createOrderDto, req.user.userId);
  // }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.orderService.createOrder(createOrderDto, req.user.userId);
  }

  @Get('intent/:orderId')
  @UseGuards(JwtAuthGuard)
  getOrderIntent(@Param('orderId') orderId: string, @Req() req) {
    const userId = req.user.userId;
    return this.orderService.getOrderIntent(orderId, userId);
  }

  @Get('sellers')
  @UseGuards(JwtAuthGuard)
  getSellerOrders(@Req() req) {
    return this.orderService.getSellerOrders(req.user.userId);
  }

  // @Post('payment')
  // @UseGuards(JwtAuthGuard)
  // createPayment(@Body() createOrderDto: CreateOrderDto, @Req() req) {
  //   return this.orderService.createPayment(createOrderDto, req.user.userId);
  // }

  // @Post('payment/webhook')
  // async handlePaymentWebhook(@Req() req, @Body() body) {
  //   const signature = req.headers['stripe-signature'];
  //   return this.orderService.handlePaymentWebhook(signature, body);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.orderService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.orderService.findOne(id, req.user.userId);
  }

  @Get('invoice/:id')
  @UseGuards(JwtAuthGuard)
  getInvoice(@Param('id') id: string, @Req() req) {
    return this.orderService.getInvoice(id, req.user.userId);
  }
}
