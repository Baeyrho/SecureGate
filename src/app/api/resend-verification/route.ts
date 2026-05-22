import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/services/users";
import { createVerificationToken } from "@/lib/services/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { email } = body as Record<string, string>;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    if (!user || user.emailVerified) {
      return NextResponse.json(
        { success: "If the account exists, a verification email has been sent." },
        { status: 200 }
      );
    }

    const verificationToken = await createVerificationToken(email);

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch {
      console.error("RESEND_VERIFICATION_EMAIL_FAILED", email);
    }

    return NextResponse.json(
      { success: "If the account exists, a verification email has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("RESEND_VERIFICATION_ERROR", error);
    return NextResponse.json(
      { success: "If the account exists, a verification email has been sent." },
      { status: 200 }
    );
  }
}
