import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export type BrevoRecipient = {
  email: string;
  name?: string;
};

export type SendTransactionalEmailInput = {
  to: BrevoRecipient[];
  subject: string;
  htmlContent?: string;
  textContent?: string;
  replyTo?: BrevoRecipient;
};

export type BrevoSendEmailResponse = {
  messageId: string;
  status: 'sent';
};

export class BrevoEmailService {
  private readonly smtpHost: string;
  private readonly smtpPort: number;
  private readonly smtpUsername: string;
  private readonly smtpPassword: string;
  private readonly defaultFrom: { email: string; name: string };

  constructor(
    smtpHost = env.smtpHost,
    smtpPort = env.smtpPort,
    smtpUsername = env.smtpUsername,
    smtpPassword = env.smtpPassword,
    defaultFrom = { email: env.emailFromAddress, name: env.emailFromName },
  ) {
    this.smtpHost = smtpHost;
    this.smtpPort = smtpPort;
    this.smtpUsername = smtpUsername;
    this.smtpPassword = smtpPassword;
    this.defaultFrom = defaultFrom;
  }

  async sendTransactionalEmail({ to, subject, htmlContent, textContent, replyTo }: SendTransactionalEmailInput): Promise<BrevoSendEmailResponse> {
    if (!this.smtpUsername || !this.smtpPassword) {
      throw new Error('Brevo SMTP credentials are not configured');
    }

    if (!to.length) {
      throw new Error('At least one recipient is required');
    }

    const transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpPort === 465,
      auth: {
        user: this.smtpUsername,
        pass: this.smtpPassword,
      },
    });

    const info = await transporter.sendMail({
      from: 'HeritageTechLabs <alawodeheritage2@gmail.com>',
      to: to.map((recipient) => (recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email)),
      replyTo: replyTo ? `${replyTo.name ?? ''} <${replyTo.email}>`.trim() : undefined,
      subject,
      text: textContent ?? '',
      html: htmlContent ?? (textContent ? `<pre>${textContent}</pre>` : '<p></p>'),
    });

    if (!info.messageId) {
      throw new Error('Brevo SMTP send returned no message id');
    }

    return {
      messageId: info.messageId,
      status: 'sent',
    };
  }
}

export const brevoEmailService = new BrevoEmailService();

export async function sendTransactionalEmail(input: SendTransactionalEmailInput): Promise<BrevoSendEmailResponse> {
  return brevoEmailService.sendTransactionalEmail(input);
}
