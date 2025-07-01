import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CryptoService } from '@/crypto/crypto.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, CryptoService],
})
export class ProductModule {}
