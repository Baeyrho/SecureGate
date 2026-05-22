import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(name: string, email: string, password: string) {
  const hashedPassword = await hash(password, 12);

  return prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
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

export async function verifyUserEmail(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
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

export async function verifyEmailWithTokenCleanup(
  userId: string,
  token: string
) {
  return prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });

    await tx.verificationToken.delete({ where: { token } });
  });
}

export async function updateUserPassword(email: string, password: string) {
  const hashedPassword = await hash(password, 12);
  return prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
}
