import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/email/mailer";
import { createAndSendOtpRecord } from "@/lib/email/otp";
import { buildSignupOtpEmail } from "@/lib/email/templates";
import { assertAuthEmailRateLimit } from "@/lib/rate-limit";
import { rateLimitJsonResponse } from "@/lib/auth/rate-limit-response";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      await assertAuthEmailRateLimit(
        request,
        "auth:register:resend",
        normalizedEmail
      );
    } catch (rateError) {
      const limited = rateLimitJsonResponse(rateError);
      if (limited) return limited;
      throw rateError;
    }

    const client = await clientPromise;
    const collection = client.db().collection("email_otps");

    const pending = await collection.findOne({
      email: normalizedEmail,
      purpose: "signup",
    });

    if (!pending?.signupData?.name || !pending.signupData.passwordHash) {
      return NextResponse.json(
        { error: "No pending signup found. Please register again." },
        { status: 404 }
      );
    }

    const otp = await createAndSendOtpRecord({
      email: normalizedEmail,
      purpose: "signup",
      signupData: {
        name: String(pending.signupData.name),
        passwordHash: String(pending.signupData.passwordHash),
      },
    });

    const template = buildSignupOtpEmail(String(pending.signupData.name), otp);
    await sendEmail({
      to: normalizedEmail,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return NextResponse.json({ message: "A new verification code was sent." });
  } catch (error) {
    console.error("Resend signup OTP error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
