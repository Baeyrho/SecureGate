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

function getBaseUrl(): string {
  // 1. Explicit APP_URL (set this in Vercel for your custom domain)
  if (process.env.APP_URL) return process.env.APP_URL;
  // 2. Vercel auto-injected URL (preview/production deployments)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // 3. Fallback for local development
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
}

const domain = getBaseUrl();

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const firstName = name.split(" ")[0];
  const confirmLink = `${domain}/auth?mode=verify-email&token=${token}`;
  await getProvider().send({
    to: email,
    subject: `Welcome ${firstName} to SecureGate`,
    html: `
      <p>Welcome ${firstName} to SecureGate, follow the link below to verify your account:</p>
      <p><a href="${confirmLink}">${confirmLink}</a></p>
      <p>Or copy and paste the link into your browser.</p>
    `,
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
