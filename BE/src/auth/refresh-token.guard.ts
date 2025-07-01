import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const token =
      req.body && 'refreshToken' in req.body ? req.body.refreshToken : null;

    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
