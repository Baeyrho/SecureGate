import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/auth";

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
        const { verifyToken, email } = credentials as Record<string, string>;

        if (verifyToken && email) {
          const token = await prisma.verificationToken.findUnique({
            where: { token: verifyToken },
          });

          if (token && token.identifier === email && token.expires > new Date()) {
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (user?.emailVerified) {
              await prisma.verificationToken.delete({ where: { token: verifyToken } });
              return user;
            }
          }

          return null;
        }

        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      if (session.user) {
        session.user.emailVerified = (token.emailVerified as Date | null) ?? null;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
  },
});
