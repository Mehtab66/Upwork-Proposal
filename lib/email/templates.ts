import { getAppName } from "@/lib/email/mailer";

function layout(content: string) {
  const appName = getAppName();

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827; max-width: 560px; margin: 0 auto; padding: 24px;">
      <h2 style="margin: 0 0 16px; color: #4f46e5;">${appName}</h2>
      ${content}
      <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">
        If you did not request this email, you can safely ignore it.
      </p>
    </div>
  `;
}

export function buildSignupOtpEmail(name: string, otp: string) {
  const appName = getAppName();

  return {
    subject: `${appName} verification code`,
    text: `Hi ${name},\n\nYour ${appName} verification code is ${otp}. It expires in 10 minutes.\n`,
    html: layout(`
      <p>Hi ${name},</p>
      <p>Use this verification code to finish creating your ${appName} account:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 24px 0;">${otp}</p>
      <p>This code expires in <strong>10 minutes</strong>.</p>
    `),
  };
}

export function buildPasswordResetOtpEmail(name: string, otp: string) {
  const appName = getAppName();

  return {
    subject: `${appName} password reset code`,
    text: `Hi ${name},\n\nYour ${appName} password reset code is ${otp}. It expires in 10 minutes.\n`,
    html: layout(`
      <p>Hi ${name || "there"},</p>
      <p>Use this code to reset your ${appName} password:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; margin: 24px 0;">${otp}</p>
      <p>This code expires in <strong>10 minutes</strong>.</p>
    `),
  };
}

export function buildWelcomeEmail(name: string) {
  const appName = getAppName();
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    subject: `Welcome to ${appName}`,
    text: `Hi ${name},\n\nWelcome to ${appName}! Your account is ready. Sign in at ${appUrl}/login\n`,
    html: layout(`
      <p>Hi ${name},</p>
      <p>Welcome to <strong>${appName}</strong>! Your account has been verified and is ready to use.</p>
      <p>You can upload resumes, manage multiple profiles, and generate personalized Upwork proposals.</p>
      <p style="margin: 24px 0;">
        <a href="${appUrl}/dashboard" style="background: #4f46e5; color: #ffffff; padding: 12px 20px; border-radius: 12px; text-decoration: none; font-weight: 600;">
          Go to Dashboard
        </a>
      </p>
    `),
  };
}
