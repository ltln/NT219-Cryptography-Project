import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { CryptoService } from '@/crypto/crypto.service';
import { TotpService } from './totp.service';
import { MailService } from '@/mail/mail.service';
import { FalconKeyService } from '@/falcon/falcon.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
    private redisService: RedisService,
    private cryptoService: CryptoService,
    private totpService: TotpService,
    private readonly mailService: MailService,
    private falconKeyService: FalconKeyService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  validateTOTP(encrypted_secret: string, code: string) {
    const mfa_secret = this.cryptoService.decrypt(encrypted_secret);
    if (this.totpService.validatePasscode(code, mfa_secret)) return true;
    return false;
  }

  async validateEmailOTP(userId: string, code: string) {
    const storedCode = await this.redisService.get(`email_otp_${userId}`);
    if (storedCode === code) {
      this.redisService.del(`email_otp_${userId}`);
      return true;
    }
    return false;
  }

  maskEmail(e: string) {
    const [l, d] = e.split('@');
    return l.length <= 3
      ? l[0] + '*'.repeat(l.length - 1) + '@' + d
      : l.slice(0, 2) + '*'.repeat(l.length - 3) + l.slice(-1) + '@' + d;
  }

  async sendEmailOTP(userId: string, userEmail: string) {
    const isCodeSent = await this.redisService.get(
      `email_otp_${userId}`,
    );
    if (isCodeSent) return;
    const code = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    this.redisService.set(
      `email_otp_${userId}`,
      code,
      'EX',
      60 * 3, // 3 minutes
    );
    await this.mailService.sendOTPMail(userEmail, code);
  }

  async generateEmailToken(userId: string, userEmail: string) {
    const stored = await this.redisService.get(`email_token_${userId}`);
    if (stored) return stored;
    const payload = { sub: userId, email: userEmail };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_EMAIL_TOKEN_SECRET,
      expiresIn: '5m',
    });
    await this.redisService.set(
      `email_token_${userId}`,
      token,
      'EX',
      60 * 5, // 5 minutes
    );
    return token;
  }

  async processEmailOTPRequest(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_EMAIL_TOKEN_SECRET,
      });
      const storedToken = await this.redisService.get(
        `email_token_${payload.sub}`,
      );
      if (!storedToken || storedToken !== token) {
        const isCodeSent = await this.redisService.get(
          `email_otp_${payload.sub}`,
        );
        if (isCodeSent) {
          return {
            message: `OTP already sent to ${this.maskEmail(payload.email)}. The code valids for 3 minutes.`,
          };
        }
        throw new BadRequestException('Invalid or expired token');
      }
      this.redisService.del(`email_token_${payload.sub}`);
      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
      this.redisService.set(
        `email_otp_${payload.sub}`,
        code,
        'EX',
        60 * 3, // 3 minutes
      );
      await this.mailService.sendOTPMail(payload.email, code);
      return {
        message: `OTP sent to ${this.maskEmail(payload.email)}. The code valids for 3 minutes.`,
      };
    } catch (error) {
      throw new BadRequestException(
        error.message || 'An error occured. Please try again later.',
      );
    }
  }

  async login(user: any) {
    const payload = {
      sub: user.userId,
      username: user.username,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '7d',
    });

    await this.redisService.set(
      `refresh_${user.StaffID}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.userId,
        username: user.username,
        fullName: this.cryptoService.decrypt(user.fullname),
        email: this.cryptoService.decrypt(user.email),
        mfa: {
          enabled: user.mfaStatus,
          email: true,
          totp: user.mfaTotpSecret ? true : false,
        },
      },
    };
  }

  async signup(
    username: string,
    email: string,
    password: string,
    fullName: string,
  ) {
    if (await this.prisma.user.findUnique({ where: { username } })) {
      throw new BadRequestException('Username already exists');
    }
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.create({
      data: {
        username,
        email: this.cryptoService.encrypt(email),
        password: hashedPassword,
        fullname: this.cryptoService.encrypt(fullName),
      },
    });

    return { success: true, message: 'User created successfully' };
  }

  async refresh(userId: string, token: string) {
    const stored = await this.redisService.get(`refresh_${userId}`);
    if (stored !== token) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) return null;
    return this.login(user);
  }

  async logout(userId: number) {
    if ((await this.redisService.get(`refresh_${userId}`)) == null) {
      throw new BadRequestException();
    }
    await this.redisService.del(`refresh_${userId}`);
    return { message: 'Logged out!' };
  }

  async profile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });
    if (!user) throw new UnauthorizedException();
    return {
      id: user.userId,
      username: user.username,
      fullName: this.cryptoService.decrypt(user.fullname),
      email: this.cryptoService.decrypt(user.email),
      verified: user.verified,
      mfa: {
        enabled: user.mfaStatus,
        email: user.mfaStatus ? true : false,
        totp: user.mfaTotpSecret ? true : false,
      },
    };
  }

  async processRequestEmailVerification(userId: string) {
    const user = await this.profile(userId);
    if (user.verified) throw new BadRequestException('Email already verified');

    const code = this.cryptoService.generateOTPCode(6);
    await this.mailService.sendOTPMail(user.email, code);
    await this.redisService.set(
      `email_verification_${userId}`,
      code,
      'EX',
      60 * 15, // 15 minutes
    );
    return {
      message: `Verification code sent to ${user.email}. The code is valid for 15 minutes.`,
    };
  }

  async processEmailVerification(userId: string, code: string) {
    const storedCode = await this.redisService.get(
      `email_verification_${userId}`,
    );
    if (!storedCode)
      throw new BadRequestException(
        'Verification code expired or not requested',
      );

    if (storedCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { userId },
      data: { verified: true },
    });

    await this.redisService.del(`email_verification_${userId}`);

    return { message: 'Email verified successfully' };
  }

  async toggleMFA(userId: string, state: boolean) {
    await this.prisma.user.update({
      where: { userId },
      data: { mfaStatus: !state },
    });
    return true;
  }

  async disableMFATOTP(userId: string) {
    await this.prisma.user.update({
      where: { userId },
      data: { mfaTotpSecret: null },
    });
    return {
      message: 'TOTP disabled successfully',
    };
  }

  async generateTOTPSecret(user: any) {
    const totp = this.totpService.generateKey(user.id);
    await this.redisService.set(
      `totp_secret_${user.id}`,
      totp.secret,
      'EX',
      60 * 60 * 24, // 1 day
    );
    const qr = await this.totpService.generateQRCodeUri(totp.url);
    return {
      message: 'TOTP added successfully',
      secret: totp.secret,
      url: totp.url,
      qr,
    };
  }

  async verifyTOTP(userId: string, code: string) {
    const storedSecret = await this.redisService.get(`totp_secret_${userId}`);
    if (!storedSecret)
      throw new BadRequestException('TOTP secret not found or expired');
    if (!code) throw new BadRequestException('Code is required');

    if (!this.totpService.validatePasscode(code, storedSecret))
      throw new BadRequestException('Invalid TOTP code');

    await this.prisma.user.update({
      where: { userId },
      data: { mfaTotpSecret: this.cryptoService.encrypt(storedSecret) },
    });
    await this.redisService.del(`totp_secret_${userId}`);
    return {
      message: 'TOTP verified successfully',
    };
  }
}
