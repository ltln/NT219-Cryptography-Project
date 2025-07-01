import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
  Res,
  Headers,
  Query,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, MFAType } from './dto/login.dto';
import { RefreshTokenGuard } from './refresh-token.guard';
import { JwtAuthGuard } from './auth.guard';
import { Response } from 'express';
import { SignupDto } from './dto/signup.dto';
import { CryptoService } from '@/crypto/crypto.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cryptoService: CryptoService
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginDto, @Res() res: Response) {
    const { username, password, code } = loginUserDto;
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new BadRequestException('Invalid credentials');
    const decryptedEmail = this.cryptoService.decrypt(user.email);
    if (user.mfaStatus) {
      if (!code) {
        try {
          await this.authService.sendEmailOTP(
            user.userId,
            decryptedEmail,
          );
          return res.status(403).json({
            message: 'A code has been sent to your email',
            error: 'MFA Required',
            mfa: true,
            email: this.authService.maskEmail(decryptedEmail),
            statusCode: 403,
          });
        } catch (error) {
          throw new InternalServerErrorException("An unexpected error occurred while authorizing the user. Please try again later.");
        }
      }

      const isValid = await this.authService.validateEmailOTP(
        user.userId,
        code,
      );

      if (!isValid) {
        throw new ForbiddenException('Invalid email OTP code');
      }
    }

    const data = await this.authService.login(user);
    return res.status(200).json(data);
  }

  async requestEmailOTP(@Headers('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }

    return this.authService.processEmailOTPRequest(token);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req) {
    const data = await this.authService.refresh(
      req.user.sub,
      req.body.refreshToken,
    );
    if (!data) throw new BadRequestException();
    return data;
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { username, email, password, confirmPassword, fullName } = signupDto;
    if (!username || !email || !password || !confirmPassword || !fullName) {
      throw new BadRequestException('Missing required fields');
    }

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match');
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      throw new BadRequestException(
        'Username can only contain alphanumeric characters and underscores',
      );

    return this.authService.signup(username, email, password, fullName);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    return this.authService.logout(req.user.userId);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req) {
    return await this.authService.profile(req.user.userId);
  }

  @Get('verify-email')
  @UseGuards(JwtAuthGuard)
  async requestEmailVerification(@Req() req) {
    return this.authService.processRequestEmailVerification(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  async verifyEmail(@Req() req, @Body('code') code: string) {
    if (!code) throw new BadRequestException('Code is required');
    return this.authService.processEmailVerification(req.user.userId, code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/toggle')
  async toggleMFA(@Req() req) {
    const user = await this.authService.profile(req.user.userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.verified)
      throw new BadRequestException('email_verification_required');
    await this.authService.toggleMFA(req.user.userId, user.mfa.enabled);
    return {
      message: `MFA ${user.mfa.enabled ? 'disabled' : 'enabled'}`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/totp')
  async generateMFATOTP(@Req() req, @Query('action') action: string) {
    if (
      !action ||
      (action !== 'generate' && action !== 'disable' && action !== 'verify')
    ) {
      throw new BadRequestException('Action param should be in suitable type');
    }

    const user = await this.authService.profile(req.user.userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.verified)
      throw new BadRequestException(
        'Email must be verified before toggling TOTP',
      );

    if (action === 'disable') {
      if (!user.mfa.totp)
        throw new BadRequestException('TOTP is not enabled for this user');
      return this.authService.disableMFATOTP(req.user.userId);
    }

    if (action === 'generate') {
      if (!user.mfa.enabled)
        throw new BadRequestException(
          'User must enable MFA before generating TOTP',
        );
      return this.authService.generateTOTPSecret(user);
    }

    if (action === 'verify') {
      const code = req.body.code;
      if (!code)
        throw new BadRequestException('Code is required for TOTP verification');
      return this.authService.verifyTOTP(user.id, code);
    }
  }
}
