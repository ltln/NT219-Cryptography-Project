import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'node:fs';
import path from 'node:path';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: 'ppt',
      endpoint: process.env.S3_ENDPOINT_URL || '',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      forcePathStyle: true,
    });
  }

  async uploadFile(bucketName: string, filePath: string, key?: string) {
    try {
      console.log(filePath);
      const fileBuffer = fs.readFileSync(filePath);
      const fileName = key || path.basename(filePath);

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: 'application/pdf',
        ContentLength: fileBuffer.length,
      });

      await this.s3.send(command);
      return 'success';
    } catch (error) {
      fs.writeFileSync('error.log', JSON.stringify(error, null, 2), {
        flag: 'a',
      });
      console.error('Upload failed:', error);
      // throw new Error('Failed to upload file to S3');
    }
  }

  async generatePresignedUrl(
    bucketName: string,
    key: string,
    expiresIn: number = 3600,
  ) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, {
      expiresIn: expiresIn, // in seconds, default is 3600 seconds (1 hour)
    });

    return url;
  }
}
