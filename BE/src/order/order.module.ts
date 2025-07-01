import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { RedisService } from '@/redis/redis.service';
import { FalconKeyService } from '@/falcon/falcon.service';
import { S3Service } from '@/s3/s3.service';
@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    PrismaService,
    CryptoService,
    RedisService,
    FalconKeyService,
    S3Service,
  ],
})
export class OrderModule {}
