import nodemailer from "nodemailer";

function getSmtpConfig() {
  const user = process.env.APP_EMAIL?.trim();
  const pass = process.env.APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error(
      "Email is not configured. Set APP_EMAIL and APP_PASSWORD in your environment."
    );
  }

  return { user, pass };
}

export function getAppName() {
  return process.env.APP_NAME?.trim() || "ProposalAI";
}

export function getMailFromAddress() {
  const { user } = getSmtpConfig();
  return `${getAppName()} <${user}>`;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const { user, pass } = getSmtpConfig();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: getMailFromAddress(),
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}
