import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export type OtpPurpose = "signup" | "password_reset";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

export interface SignupOtpPayload {
  name: string;
  passwordHash: string;
}

function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getOtpCollection() {
  return clientPromise.then((client) => client.db().collection("email_otps"));
}

export async function createAndSendOtpRecord(input: {
  email: string;
  purpose: OtpPurpose;
  signupData?: SignupOtpPayload;
}) {
  const otp = generateOtpCode();
  const otpHash = await bcrypt.hash(otp, 10);
  const now = new Date();

  const collection = await getOtpCollection();

  await collection.updateOne(
    { email: input.email, purpose: input.purpose },
    {
      $set: {
        email: input.email,
        purpose: input.purpose,
        otpHash,
        expiresAt: new Date(now.getTime() + OTP_EXPIRY_MS),
        attempts: 0,
        updatedAt: now,
        signupData: input.signupData,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  return otp;
}

export async function verifyOtp(input: {
  email: string;
  purpose: OtpPurpose;
  otp: string;
}) {
  const collection = await getOtpCollection();
  const record = await collection.findOne({
    email: input.email,
    purpose: input.purpose,
  });

  if (!record) {
    return { ok: false as const, error: "Verification code not found or expired." };
  }

  if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
    await collection.deleteOne({ _id: record._id });
    return { ok: false as const, error: "Verification code has expired." };
  }

  const attempts = Number(record.attempts || 0);
  if (attempts >= MAX_OTP_ATTEMPTS) {
    return {
      ok: false as const,
      error: "Too many failed attempts. Request a new code.",
    };
  }

  const isValid = await bcrypt.compare(input.otp, String(record.otpHash));

  if (!isValid) {
    await collection.updateOne(
      { _id: record._id },
      { $inc: { attempts: 1 }, $set: { updatedAt: new Date() } }
    );

    return { ok: false as const, error: "Invalid verification code." };
  }

  await collection.deleteOne({ _id: record._id });

  return {
    ok: true as const,
    signupData: record.signupData as SignupOtpPayload | undefined,
  };
}
