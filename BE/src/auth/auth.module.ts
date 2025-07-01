import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from '@/prisma/prisma.module';
import { RedisModule } from '@/redis/redis.module';
import { CryptoService } from '@/crypto/crypto.service';
import { TotpService } from './totp.service';
import { MailService } from '@/mail/mail.service';
import { FalconKeyService } from '@/falcon/falcon.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtService,
    CryptoService,
    TotpService,
    MailService,
    FalconKeyService,
  ],
  imports: [PrismaModule, RedisModule],
})
export class AuthModule {}
