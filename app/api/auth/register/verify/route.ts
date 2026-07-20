import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/email/mailer";
import { verifyOtp } from "@/lib/email/otp";
import { buildWelcomeEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json(
        { error: "Email and verification code are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const verification = await verifyOtp({
      email: normalizedEmail,
      purpose: "signup",
      otp: String(otp).trim(),
    });

    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    if (!verification.signupData?.name || !verification.signupData.passwordHash) {
      return NextResponse.json(
        { error: "Signup session expired. Please register again." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const users = client.db().collection("users");

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    await users.insertOne({
      name: verification.signupData.name,
      email: normalizedEmail,
      password: verification.signupData.passwordHash,
      emailVerified: new Date(),
      image: null,
      createdAt: new Date(),
    });

    try {
      const welcome = buildWelcomeEmail(verification.signupData.name);
      await sendEmail({
        to: normalizedEmail,
        subject: welcome.subject,
        html: welcome.html,
        text: welcome.text,
      });
    } catch (emailError) {
      console.error("Welcome email error:", emailError);
    }

    return NextResponse.json({
      message: "Account verified successfully.",
    });
  } catch (error) {
    console.error("Registration verify error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
