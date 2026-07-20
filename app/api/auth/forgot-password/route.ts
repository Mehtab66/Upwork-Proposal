import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/email/mailer";
import { createAndSendOtpRecord } from "@/lib/email/otp";
import { buildPasswordResetOtpEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
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
        message:
          "If an account exists for this email, a reset code has been sent.",
      });
    }

    const otp = await createAndSendOtpRecord({
      email: normalizedEmail,
      purpose: "password_reset",
    });

    const template = buildPasswordResetOtpEmail(
      String(user.name || ""),
      otp
    );

    await sendEmail({
      to: normalizedEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({
      message: "Password reset code sent to your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Forgot password OTP error:", error);

    const message =
      error instanceof Error && error.message.includes("Email is not configured")
        ? error.message
        : "Something went wrong. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
