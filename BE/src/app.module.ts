import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CryptoService } from './crypto/crypto.service';
import { MailService } from './mail/mail.service';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { S3Module } from './s3/s3.module';
import { FalconKeyService } from './falcon/falcon.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ProductModule,
    OrderModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService, CryptoService, MailService, FalconKeyService],
})
export class AppModule {}
