import type { EmailProvider } from "./types";
import { NodemailerEmailProvider } from "./nodemailer";

let provider: EmailProvider | null = null;

function getProvider(): EmailProvider {
  if (!provider) {
    provider = new NodemailerEmailProvider({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
      from: process.env.SMTP_FROM!,
    });
  }
  return provider;
}

export function setEmailProvider(p: EmailProvider) {
  provider = p;
}

const domain = process.env.NEXTAUTH_URL;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/auth?mode=verify-email&token=${token}`;
  await getProvider().send({
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/auth?mode=reset-password&token=${token}`;
  await getProvider().send({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
