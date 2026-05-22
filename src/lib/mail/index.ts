import type { EmailProvider } from "./types";
import { ResendEmailProvider } from "./resend";

let provider: EmailProvider | null = null;

function getProvider(): EmailProvider {
  if (!provider) {
    provider = new ResendEmailProvider(process.env.RESEND_API_KEY!);
  }
  return provider;
}

export function setEmailProvider(p: EmailProvider) {
  provider = p;
}

const domain = process.env.NEXTAUTH_URL;

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${domain}/verify-email/${token}`;
  await getProvider().send({
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${domain}/reset-password/${token}`;
  await getProvider().send({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
}
