import { NextResponse } from "next/server";
import { signUpSchema } from "@/schemas/auth";
import { findUserByEmail, createUserWithVerificationToken } from "@/lib/services/users";
import { generateToken, VERIFICATION_TOKEN_EXPIRY } from "@/lib/services/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const validatedFields = signUpSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const verificationToken = generateToken();
    const expires = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

    await createUserWithVerificationToken(name, email, password, verificationToken, expires);

    // Email send failure should not block signup — user can resend
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch {
      console.error("SIGNUP_EMAIL_FAILED", email);
    }

    return NextResponse.json({ success: "Verification email sent!" }, { status: 201 });
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
