import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/schemas/auth";
import { findPasswordResetToken } from "@/lib/services/tokens";
import { resetPasswordWithTokenCleanup } from "@/lib/services/users";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { token, password, confirmPassword } = body as Record<string, string>;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const validatedFields = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const resetToken = await findPasswordResetToken(token);

    if (!resetToken || resetToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
    }

    await resetPasswordWithTokenCleanup(resetToken.email, password, token);

    return NextResponse.json({ success: "Password reset successful!" }, { status: 200 });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
