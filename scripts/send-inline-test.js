import path from "path";
import { sendMail } from "../src/lib/mail.js";

async function run() {
  const logoCid = "logo@informaticacompany.com";
  const html = `<p>Inline logo test</p><img src="cid:${logoCid}" style="height:120px;"/>`;
  const res = await sendMail({
    to: "oy_shaath@esi.dz",
    subject: "[TEST] Inline logo",
    html,
    attachments: [
      {
        filename: "logo.jpg",
        path: path.join(process.cwd(), "public", "logo.jpg"),
        cid: logoCid,
      },
    ],
  });
  console.log("SEND RESULT ->", res);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
