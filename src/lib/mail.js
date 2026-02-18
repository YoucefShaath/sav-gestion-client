import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, html, attachments } = {}) {
  // Dev fallback: if SMTP not configured, don't fail — simulate success so local testing works.
  if (
    process.env.NODE_ENV !== "production" &&
    (!process.env.SMTP_USER || !process.env.SMTP_PASS)
  ) {
    console.warn("SMTP not configured — skipping send (dev fallback)");
    console.log("Email to:", to, "subject:", subject);
    if (attachments)
      console.log(
        "Attachments:",
        attachments.map((a) => a.filename),
      );
    return { success: true, simulated: true };
  }

  const t = getTransporter();
  try {
    const mailOptions = {
      from: `"Informatica SAV" <${process.env.SMTP_USER || "noreply@informaticacompany.com"}>`,
      to,
      subject,
      html,
    };
    if (attachments) mailOptions.attachments = attachments;

    const info = await t.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err.message };
  }
}
