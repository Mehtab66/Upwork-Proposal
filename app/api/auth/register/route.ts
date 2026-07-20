import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/email/mailer";
import { createAndSendOtpRecord } from "@/lib/email/otp";
import { buildSignupOtpEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const client = await clientPromise;
    const users = client.db().collection("users");

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = await createAndSendOtpRecord({
      email: normalizedEmail,
      purpose: "signup",
      signupData: {
        name: name.trim(),
        passwordHash,
      },
    });

    const template = buildSignupOtpEmail(name.trim(), otp);
    await sendEmail({
      to: normalizedEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({
      message: "Verification code sent to your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration OTP error:", error);

    const message =
      error instanceof Error && error.message.includes("Email is not configured")
        ? error.message
        : "Something went wrong. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
