import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(req) {
  const data = await req.json();
  const required = [
    "type",
    "company_name",
    "contact_phone",
    "contact_email",
    "description",
  ];
  const missing = required.filter((f) => !data[f] || !String(data[f]).trim());
  if (missing.length)
    return NextResponse.json(
      { error: `Champs obligatoires manquants: ${missing.join(", ")}` },
      { status: 422 },
    );
  const { type, company_name, contact_phone, contact_email, description } =
    data;
  const urgency = data.urgency || "normal";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact_email))
    return NextResponse.json(
      { error: "Adresse email invalide." },
      { status: 422 },
    );
  if (!["achat", "prestation"].includes(type))
    return NextResponse.json(
      { error: "Type de demande invalide." },
      { status: 422 },
    );
  const to =
    type === "achat" ? "commercial@it-smv.com" : "technique@it-smv.com";
  const typeLabel =
    type === "achat" ? "Demande d'achat" : "Demande de prestation";
  const urgencyLabel =
    { normal: "Normale", moyenne: "Moyenne", urgente: "Urgente" }[urgency] ||
    "Normale";
  const subject = `[Informatica] ${typeLabel} - ${company_name}`;
  const body = `<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;'><div style='background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0;'><h2 style='margin: 0; font-size: 18px;'>📋 ${typeLabel}</h2><p style='margin: 5px 0 0; font-size: 12px; color: #93c5fd;'>Informatica — Espace Entreprise</p></div><div style='padding: 20px;'><p><strong>Entreprise:</strong> ${company_name}</p><p><strong>Téléphone:</strong> ${contact_phone}</p><p><strong>Email:</strong> ${contact_email}</p><p><strong>Urgence:</strong> ${urgencyLabel}</p><p><strong>Description:</strong><br>${description.replace(/\n/g, "<br>")}</p></div></body></html>`;
  try {
    await sendMail({ to, subject, html: body });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email." },
      { status: 500 },
    );
  }
}
