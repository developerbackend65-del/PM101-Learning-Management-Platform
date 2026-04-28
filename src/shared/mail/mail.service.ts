import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {
    sgMail.setApiKey(this.config.get<string>('SENDGRID_API_KEY')!);
  }

  /**
   * Sends an email verification message to the specified email address.
   *
   * Uses a predefined SendGrid dynamic template, passing the verification
   * link as template data.
   *
   * @param email - The recipient's email address.
   * @param link - The verification URL to be embedded in the email template.
   * @returns A promise that resolves with the SendGrid API response.
   */
  public sendVerifyEmail(email: string, link: string) {
    const msg = {
      to: email,
      from: this.config.get<string>('SENDGRID_FROM_EMAIL')!,
      templateId: this.config.get<string>('SENDGRID_VERIFY_TEMPLATE_ID')!,
      dynamicTemplateData: {
        link,
      },
    };

    return sgMail.send(msg);
  }

  /**
   * Sends a password reset email to the specified email address.
   *
   * Uses a predefined SendGrid dynamic template, passing the password reset
   * link as template data.
   *
   * @param email - The recipient's email address.
   * @param link - The password reset URL to be embedded in the email template.
   * @returns A promise that resolves with the SendGrid API response.
   */
  public sendResetPassword(email: string, link: string) {
    const msg = {
      to: email,
      from: this.config.get<string>('SENDGRID_FROM_EMAIL')!,
      templateId: this.config.get<string>('SENDGRID_RESET_TEMPLATE_ID')!,
      dynamicTemplateData: {
        link,
      },
    };

    return sgMail.send(msg);
  }
}
