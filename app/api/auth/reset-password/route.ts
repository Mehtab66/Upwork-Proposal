import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/email/mailer";
import { createAndSendOtpRecord, verifyOtp } from "@/lib/email/otp";
import { buildPasswordResetOtpEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const { email, otp, password, confirmPassword } = await request.json();

    if (!email?.trim() || !otp?.trim() || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Email, verification code, and new password are required." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
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
    const verification = await verifyOtp({
      email: normalizedEmail,
      purpose: "password_reset",
      otp: String(otp).trim(),
    });

    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    const client = await clientPromise;
    const users = client.db().collection("users");
    const user = await users.findOne({ email: normalizedEmail });

    if (!user?.password) {
      return NextResponse.json(
        { error: "Password reset is only available for email accounts." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Password updated successfully. You can sign in now.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const client = await clientPromise;
    const user = await client
      .db()
      .collection("users")
      .findOne({ email: normalizedEmail });

    if (!user?.password) {
      return NextResponse.json({
        message: "If an account exists for this email, a reset code has been sent.",
      });
    }

    const otp = await createAndSendOtpRecord({
      email: normalizedEmail,
      purpose: "password_reset",
    });

    const template = buildPasswordResetOtpEmail(String(user.name || ""), otp);
    await sendEmail({
      to: normalizedEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({ message: "A new reset code was sent." });
  } catch (error) {
    console.error("Resend reset OTP error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
