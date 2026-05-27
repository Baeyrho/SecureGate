import nodemailer from "nodemailer";
import type { EmailProvider, SendEmailOptions } from "./types";

const EMAIL_TIMEOUT = 10_000;

export class NodemailerEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor(config: {
    host: string;
    port: number;
    user: string;
    pass: string;
    from: string;
  }) {
    this.from = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
  }

  async send(options: SendEmailOptions): Promise<void> {
    await Promise.race([
      this.transporter.sendMail({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Email send timed out")), EMAIL_TIMEOUT)
      ),
    ]);
  }
}
