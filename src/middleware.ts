import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/ratelimit";

export default auth(async (req) => {
  try {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicApiRoute = ["/api/signup", "/api/verify-email", "/api/forgot-password", "/api/reset-password", "/api/resend-verification"].includes(nextUrl.pathname);
    const isPublicRoute = ["/", "/auth"].includes(nextUrl.pathname);
    const isAuthRoute = nextUrl.pathname === "/auth" || nextUrl.pathname === "/";

    if (nextUrl.pathname === "/api/auth/callback/credentials" && req.method === "POST") {
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
        return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
      return NextResponse.redirect(new URL("/auth?mode=login", nextUrl));
    }

    if (isLoggedIn && !req.auth?.user?.emailVerified && nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/auth?mode=verify-pending", nextUrl));
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
