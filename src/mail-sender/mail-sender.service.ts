import { Injectable, Logger } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

import { confirmMail } from './templates';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailSenderService {
  private transporter: Mail;
  private senderCredentials;
  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      auth: {
        user: this.configService.get<string>('mailer.service.user'),
        pass: this.configService.get<string>('mailer.service.pass'),
      },
      host: this.configService.get<string>('mailer.service.host'),
      port: this.configService.get<number>('mailer.service.port'),
      secure: this.configService.get<boolean>('mailer.service.secure'),
    });
    this.senderCredentials = {
      name: this.configService.get<string>('mailer.senderCredentials.name'),
      email: this.configService.get<string>('mailer.senderCredentials.email'),
    };
  }

  async sendVerifyEmailMail(email: string, otp: string): Promise<boolean> {
    const mail = confirmMail.replace(new RegExp('--otp--', 'g'), otp);

    const mailOptions = {
      from: `"${this.senderCredentials.name}" <${this.senderCredentials.email}>`,
      to: email,
      subject: `Welcome to Felic.xyz ! Confirm Your Email`,
      html: mail,
    };

    return new Promise<boolean>((resolve) =>
      this.transporter.sendMail(mailOptions, async (error) => {
        if (error) {
          console.log('error', error);
          resolve(false);
        }
        resolve(true);
      }),
    );
  }
}
