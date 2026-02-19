import pool from "@/lib/db";
import { NextResponse } from "next/server";

// Dev-only fallback for tickets (list + detail) — mirrors php-api/api/tickets.php GET behavior
export async function GET(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const conn = await pool.getConnection();
  try {
    if (id) {
      const [rows] = await conn.query(
        "SELECT * FROM tickets WHERE ticket_id = ?",
        [id],
      );
      const ticket = rows[0];
      if (!ticket)
        return NextResponse.json(
          { error: "Ticket introuvable." },
          { status: 404 },
        );
      const [history] = await conn.query(
        "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
        [id],
      );
      ticket.history = history;
      return NextResponse.json(ticket);
    }

    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");
    const priority = url.searchParams.get("priority");
    const search = url.searchParams.get("search");
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      parseInt(url.searchParams.get("limit") || "50", 10),
    );
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];
    if (status) {
      where.push("status = ?");
      params.push(status);
    }
    if (category) {
      where.push("hardware_category = ?");
      params.push(category);
    }
    if (priority) {
      where.push("priority = ?");
      params.push(priority);
    }
    if (search) {
      where.push(
        "(client_name LIKE ? OR client_phone LIKE ? OR ticket_id LIKE ?)",
      );
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    let sql = "SELECT * FROM tickets";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql +=
      " ORDER BY FIELD(priority, 'Urgent','High','Normal','Low'), created_at DESC";

    // count
    const countSql = sql.replace(/SELECT \*/i, "SELECT COUNT(*) as total");
    const [[countRow]] = await conn.query(countSql, params);
    const total = Number(countRow?.total || 0);

    sql += " LIMIT ? OFFSET ?";
    const rows = await conn.query(sql, params.concat([limit, offset]));
    const data = rows[0];

    return NextResponse.json({
      data,
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
  // Dev-only createTicket fallback (mirrors php-api/api/tickets.php)
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

  const {
    client_name,
    client_phone,
    client_email,
    hardware_category,
    brand,
    model,
    reference,
    serial_number,
    problem_description,
    priority = "Normal",
    location = "Reception",
  } = body;

  // Basic validation (same rules as php-api)
  const errors = [];
  if (!client_name || !String(client_name).trim()) errors.push("client_name");
  if (!client_phone || !String(client_phone).trim())
    errors.push("client_phone");
  if (!hardware_category || !String(hardware_category).trim())
    errors.push("hardware_category");
  if (!brand || !String(brand).trim()) errors.push("brand");
  if (!problem_description || !String(problem_description).trim())
    errors.push("problem_description");
  if (errors.length)
    return NextResponse.json(
      { errors, error: "Champs obligatoires manquants." },
      { status: 422 },
    );

  // reuse client-side phone validator
  const { validatePhone } = await import("@/lib/utils");
  if (!validatePhone(client_phone))
    return NextResponse.json(
      { error: "Numéro de téléphone invalide." },
      { status: 422 },
    );

  const conn = await pool.getConnection();
  try {
    // Generate ticket id SAV-YYMMDD-XXXX
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const prefix = `SAV-${yy}${mm}${dd}-`;

    const [[last]] = await conn.query(
      "SELECT ticket_id FROM tickets WHERE ticket_id LIKE ? ORDER BY id DESC LIMIT 1",
      [prefix + "%"],
    );
    let seq = 1;
    if (last && last.ticket_id) {
      const n = parseInt(last.ticket_id.slice(-4), 10);
      if (n) seq = n + 1;
    }
    const ticketId = prefix + String(seq).padStart(4, "0");

    await conn.query(
      `INSERT INTO tickets (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, status, location, priority, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Received', ?, ?, NOW(), NOW())`,
      [
        ticketId,
        client_name,
        client_phone,
        client_email || null,
        hardware_category,
        brand,
        model || null,
        serial_number || null,
        problem_description,
        location || null,
        priority || "Normal",
      ],
    );

    await conn.query(
      "INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, ?, NOW())",
      [ticketId, "Received"],
    );

    const [[ticket]] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [ticketId],
    );
    const [history] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [ticketId],
    );
    ticket.history = history;

    return NextResponse.json(ticket);
  } catch (err) {
    console.error("dev /api/tickets POST error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du ticket." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
