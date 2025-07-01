import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { ProductDto } from './dto/create-product.dto';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyProducts(@Req() req) {
    return this.productService.getMyProducts(req.user.userId); 
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Req() req, @Body() productData: ProductDto) {
    return this.productService.createProduct(req.user.userId, productData);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() productData: ProductDto, @Req() req) {
    return this.productService.updateProduct(req.user.userId, id, productData);
  }

}
