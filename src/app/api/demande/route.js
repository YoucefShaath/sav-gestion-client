import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Dev fallback for entreprise 'demande' endpoint (GET list, POST create)
export async function GET(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || null;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    parseInt(url.searchParams.get("limit") || "50", 10),
  );
  const offset = (page - 1) * limit;

  const conn = await pool.getConnection();
  try {
    const where = [];
    const params = [];
    if (type) {
      where.push("type = ?");
      params.push(type);
    }
    let sql = "SELECT * FROM demandes";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY created_at DESC";

    const countSql = sql.replace(/SELECT \*/i, "SELECT COUNT(*) as total");
    const [[countRow]] = await conn.query(countSql, params);
    const total = Number(countRow?.total || 0);

    sql += " LIMIT ? OFFSET ?";
    const [rows] = await conn.query(sql, params.concat([limit, offset]));

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
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

  const {
    type,
    company_name,
    contact_phone,
    contact_email,
    description,
    urgency,
  } = body;
  const required = [
    "type",
    "company_name",
    "contact_phone",
    "contact_email",
    "description",
  ];
  const missing = required.filter(
    (k) => !body[k] || String(body[k]).trim() === "",
  );
  if (missing.length)
    return NextResponse.json(
      { error: "Champs obligatoires manquants: " + missing.join(", ") },
      { status: 422 },
    );

  if (!["achat", "prestation"].includes(type))
    return NextResponse.json(
      { error: "Type de demande invalide." },
      { status: 422 },
    );

  const conn = await pool.getConnection();
  try {
    const [res] = await conn.query(
      "INSERT INTO demandes (type, company_name, contact_phone, contact_email, description, urgency, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [
        type,
        company_name,
        contact_phone,
        contact_email || null,
        description,
        urgency || "normal",
      ],
    );
    return NextResponse.json({ success: true, id: res.insertId });
  } finally {
    conn.release();
  }
}
