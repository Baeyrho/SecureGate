import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/auth";

async function authorizeWithPassword(credentials: Record<string, unknown>) {
  const validatedFields = loginSchema.safeParse(credentials);

  if (!validatedFields.success) return null;

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) return null;

  const passwordsMatch = await compare(password, user.password);
  return passwordsMatch ? user : null;
}

async function authorizeWithVerifyToken(token: string, email: string) {
  const stored = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!stored || stored.identifier !== email || stored.expires <= new Date()) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.emailVerified) return null;

  await prisma.verificationToken.delete({ where: { token } });
  return user;
}

export const { 
  handlers: { GET, POST }, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  pages: {
    signIn: "/auth?mode=login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const raw = credentials as Record<string, string>;

        if (raw.verifyToken && raw.email) {
          return authorizeWithVerifyToken(raw.verifyToken, raw.email);
        }

        return authorizeWithPassword(credentials);
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
