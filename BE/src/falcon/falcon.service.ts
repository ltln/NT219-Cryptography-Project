import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FalconKeyService implements OnModuleInit {
  public publicKey: Buffer;
  public privateKey: Buffer;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const pubPath = this.configService.get<string>('FALCON_PUBLIC_KEY_PATH');
    const privPath = this.configService.get<string>('FALCON_PRIVATE_KEY_PATH');

    if (!pubPath || !privPath) {
      throw new Error('Falcon key paths are not defined in the .env file.');
    }

    const pubKeyBase64 = fs.readFileSync(path.resolve(pubPath), 'utf8');
    const privKeyBase64 = fs.readFileSync(path.resolve(privPath), 'utf8');

    this.publicKey = Buffer.from(pubKeyBase64, 'base64');
    this.privateKey = Buffer.from(privKeyBase64, 'base64');
  }
}
