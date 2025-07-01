// src/auth/totp.service.ts
import { Injectable } from '@nestjs/common';
import { Totp } from 'time2fa';
import * as qrcode from 'qrcode';
@Injectable()
export class TotpService {
  generateKey(userId: string) {
    const key = Totp.generateKey({
      user: userId,
      issuer: 'Dreamer Hospital',
    });

    return key;
  }

  async generateQRCodeUri(url: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await qrcode.toDataURL(url);
  }

  // async generateQRCode(userId: string) {
  //     const key = this.generateKey(userId);
  //     const qrCodeDataUrl = await qrcode.toDataURL(key.url);
  //     return { key, qrCodeDataUrl };
  // }

  validatePasscode(passcode: string, secret: string): boolean {
    return Totp.validate({ passcode, secret, drift: 2 });
  }
}
