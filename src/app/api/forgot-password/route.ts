import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/schemas/auth";
import { findUserByEmail } from "@/lib/services/users";
import { createPasswordResetToken } from "@/lib/services/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ratelimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    // Rate limiter fail-open: if Redis is down, allow request through
    try {
      const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
      const { success: limitSuccess } = await ratelimit.limit(ip);

      if (!limitSuccess) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      }
    } catch {
      // Rate limiter unavailable — fail open
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validatedFields = forgotPasswordSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { email } = validatedFields.data;

    const successResponse = NextResponse.json(
      { success: "If an account exists with that email, a reset link has been sent." },
      { status: 200 }
    );

    const user = await findUserByEmail(email);
    if (!user) {
      return successResponse;
    }

    const resetToken = await createPasswordResetToken(email);

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch {
      console.error("FORGOT_PASSWORD_EMAIL_FAILED", email);
    }

    return successResponse;
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
