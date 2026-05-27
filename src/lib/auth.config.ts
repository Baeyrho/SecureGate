import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth?mode=login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [], // Providers will be added in auth.ts to avoid Edge Runtime issues
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
