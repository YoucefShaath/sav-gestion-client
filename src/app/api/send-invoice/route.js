import { sendMail } from "@/lib/mail";
import path from "path";

export async function POST(req) {
  const { to, subject, html } = await req.json();
  if (!to || !subject || !html)
    return Response.json({ error: "Missing fields" }, { status: 400 });

  const logoCid = "logo@informaticacompany.com";
  let bodyHtml = html;
  if (
    !/cid:logo@informaticacompany.com/.test(html) &&
    !/\/logo\.jpg/.test(html)
  ) {
    bodyHtml =
      `<div style="padding-bottom:10px"><img src="cid:${logoCid}" alt="Informatica" style="height:60px;object-fit:contain"/></div>` +
      html;
  }

  const attachments = [
    {
      filename: "logo.jpg",
      path: path.join(process.cwd(), "public", "logo.jpg"),
      cid: logoCid,
    },
  ];

  try {
    const result = await sendMail({ to, subject, html: bodyHtml, attachments });
    if (!result.success)
      return Response.json(
        { error: result.error || "Failed to send" },
        { status: 500 },
      );
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
