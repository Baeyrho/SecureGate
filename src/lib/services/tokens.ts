import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const VERIFICATION_TOKEN_EXPIRY = 15 * 60 * 1000; // 15 minutes
export const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

export async function createVerificationToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

  // Delete stale tokens for this email before creating a new one
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });

  return token;
}

export async function createPasswordResetToken(email: string) {
  const token = generateToken();
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  // Delete stale tokens for this email before creating a new one
  await prisma.passwordResetToken.deleteMany({ where: { email } });

  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  return token;
}

export async function findVerificationToken(token: string) {
  return prisma.verificationToken.findUnique({ where: { token } });
}

export async function findPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({ where: { token } });
}
