import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  try {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicApiRoute = ["/api/signup", "/api/verify-email", "/api/forgot-password", "/api/reset-password", "/api/resend-verification"].includes(nextUrl.pathname);
    const isPublicRoute = ["/", "/auth"].includes(nextUrl.pathname);
    const isAuthRoute = nextUrl.pathname === "/auth" || nextUrl.pathname === "/";

    if (nextUrl.pathname.startsWith("/api/auth") && req.method === "POST") {
      try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const { success } = await ratelimit.limit(`login_${ip}`);
        if (!success) {
          return NextResponse.json({ error: "Too many login attempts." }, { status: 429 });
        }
      } catch {
        // Rate limiter unavailable — allow request through (fail open)
      }
    }

    if (isApiAuthRoute || isPublicApiRoute) return NextResponse.next();

    if (isAuthRoute) {
      if (isLoggedIn) {
        const mode = nextUrl.searchParams.get("mode");
        const isExemptMode = ["verify-pending", "forgot-password", "reset-password", "verify-email"].includes(mode || "");
        
        if (isExemptMode) {
          return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL("/auth?mode=login", nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("MIDDLEWARE_ERROR", error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next|api/auth).*)", "/", "/(api|trpc)(.*)"],
};
