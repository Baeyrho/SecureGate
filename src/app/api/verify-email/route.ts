import { NextResponse } from "next/server";
import { findVerificationToken } from "@/lib/services/tokens";
import { verifyEmailWithTokenExtension, findUserByEmail } from "@/lib/services/users";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { token } = body as Record<string, string>;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token missing" }, { status: 400 });
    }

    const verificationToken = await findVerificationToken(token);

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
    }

    const user = await findUserByEmail(verificationToken.identifier);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await verifyEmailWithTokenExtension(user.id, token);

    return NextResponse.json({ success: "Email verified successfully", email: user.email }, { status: 200 });
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
