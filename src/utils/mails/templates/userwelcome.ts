import { transporter } from "../mailer";

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Mail sent to:", to);
  } catch (err) {
    console.error("❌ Mail send error:", err);
  }
}
