import { Resend } from "resend";
import type { EmailProvider, SendEmailOptions } from "./types";

const EMAIL_TIMEOUT = 10_000; // 10 seconds

export class ResendEmailProvider implements EmailProvider {
  private client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(options: SendEmailOptions): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT);

    try {
      await this.client.emails.send({
        from: "SecureGate <noreply@yourdomain.com>",
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}
