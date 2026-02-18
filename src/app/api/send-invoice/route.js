import nodemailer from "nodemailer";

export async function POST(req) {
  const { to, subject, html } = await req.json();
  if (!to || !subject || !html)
    return Response.json({ error: "Missing fields" }, { status: 400 });

  // Configure SMTP (update with your cPanel SMTP credentials)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `Informatica SAV <noreply@informaticacompany.com>`,
      to,
      subject,
      html,
    });
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
