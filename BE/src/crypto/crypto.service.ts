import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  private readonly ivLength = 16;

  constructor() {
    const keyFromEnv = process.env.AES_ENCRYPTION_KEY || 'placeholder';
    this.key = Buffer.from(keyFromEnv, 'utf-8');
    if (this.key.length !== 32) {
      throw new Error('AES key must be 32 bytes long');
    }
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const authTag = cipher.getAuthTag();

    const encryptedData = [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted,
    ].join(':');

    return encryptedData;
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'base64');
    const authTag = Buffer.from(parts[1], 'base64');
    const encryptedText = parts[2];

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  generateOTPCode(length: number = 6): string {
    const max = 10 ** length;
    return Math.floor(Math.random() * max)
      .toString()
      .padStart(length, '0');
  }

  generateTOTPSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    return [...Array(16)]
      .map(() => chars.charAt((Math.random() * chars.length) | 0))
      .join('');
  }
}
