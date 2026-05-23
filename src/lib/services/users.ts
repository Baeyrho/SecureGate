import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUserWithVerificationToken(
  name: string,
  email: string,
  password: string,
  token: string,
  tokenExpires: Date
) {
  const hashedPassword = await hash(password, 12);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, password: hashedPassword },
    });

    await tx.verificationToken.create({
      data: { identifier: email, token, expires: tokenExpires },
    });

    return user;
  });
}

export async function resetPasswordWithTokenCleanup(
  email: string,
  password: string,
  token: string
) {
  const hashedPassword = await hash(password, 12);

  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    await tx.passwordResetToken.delete({ where: { token } });
  });
}

export async function verifyEmailWithTokenExtension(
  userId: string,
  token: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await tx.verificationToken.update({
      where: { token },
      data: { expires: new Date(Date.now() + 5 * 60 * 1000) },
    });
  });
}
