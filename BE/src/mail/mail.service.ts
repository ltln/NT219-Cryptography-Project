import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailTemplate } from './html_mail';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendOTPMail(email: string, code: string) {
    const mailOptions = {
      from: process.env.SMTP_FROM, // sender address
      to: email,
      subject: 'Your OTP Code',
      text: '',
      html: emailTemplate(code),
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send OTP email');
    }
  }
}
