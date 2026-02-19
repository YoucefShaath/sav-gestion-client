import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const type = url.searchParams.get("type");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));
  const offset = (page - 1) * limit;

  const conn = await pool.getConnection();
  try {
    let where = [];
    let params = [];
    if (type) {
      where.push("type = ?");
      params.push(type);
    }
    let sql = "SELECT * FROM demandes";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY created_at DESC";

    const [countRows] = await conn.query(
      sql.replace("SELECT *", "SELECT COUNT(*) as total"),
      params,
    );
    const total = countRows[0]?.total || 0;

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const [rows] = await conn.query(sql, params);
    return NextResponse.json({
      data: rows,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } finally {
    conn.release();
  }
}

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

  // Persist to DB (return success even if email sending later fails)
  const conn = await pool.getConnection();
  let insertedId = null;
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO demandes (type, company_name, contact_phone, contact_email, description, urgency, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        type,
        company_name,
        contact_phone,
        contact_email || null,
        description,
        urgency,
      ],
    );
    insertedId = result.insertId || null;
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    console.error("Failed to save demande:", err);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde de la demande." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }

  // Try to send notification email but don't fail the request if email fails
  const to =
    type === "achat" ? "commercial@it-smv.com" : "technique@it-smv.com";
  const typeLabel =
    type === "achat" ? "Demande d'achat" : "Demande de prestation";
  const urgencyLabel =
    { normal: "Normale", moyenne: "Moyenne", urgente: "Urgente" }[urgency] ||
    "Normale";
  const subject = `[Informatica] ${typeLabel} - ${company_name}`;
  const body = `<!DOCTYPE html><html lang='fr'><head><meta charset='UTF-8'></head><body style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;'><div style='background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0; display:flex; align-items:center; gap:12px;'><img src="cid:logo@informaticacompany.com" alt="Informatica" style="height:48px;object-fit:contain" /><div><h2 style='margin: 0; font-size: 18px;'>📋 ${typeLabel}</h2><p style='margin: 5px 0 0; font-size: 12px; color: #93c5fd;'>Informatica — Espace Entreprise</p></div></div><div style='padding: 20px;'><p><strong>Entreprise:</strong> ${company_name}</p><p><strong>Téléphone:</strong> ${contact_phone}</p><p><strong>Email:</strong> ${contact_email}</p><p><strong>Urgence:</strong> ${urgencyLabel}</p><p><strong>Description:</strong><br>${description.replace(/\n/g, "<br>")}</p></div></body></html>`;

  try {
    await sendMail({ to, subject, html: body });
  } catch (e) {
    console.error("Failed to send demande notification email:", e);
  }

  return NextResponse.json({ success: true, id: insertedId });
}

export async function DELETE(req) {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT id FROM demandes WHERE id = ?", [
      id,
    ]);
    if (!rows.length)
      return NextResponse.json(
        { error: "Demande introuvable." },
        { status: 404 },
      );
    await conn.query("DELETE FROM demandes WHERE id = ?", [id]);
    return NextResponse.json({ success: true });
  } finally {
    conn.release();
  }
}
