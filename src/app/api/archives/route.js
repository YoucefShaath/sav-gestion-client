import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Dev-only fallback for archives (GET)
export async function GET(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const ticketId = url.searchParams.get("id");
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.min(
    100,
    parseInt(url.searchParams.get("limit") || "50", 10),
  );
  const offset = (page - 1) * limit;

  const conn = await pool.getConnection();
  try {
    if (ticketId) {
      const [rows] = await conn.query(
        "SELECT * FROM archives WHERE ticket_id = ?",
        [ticketId],
      );
      const row = rows[0];
      if (!row)
        return NextResponse.json(
          { error: "Archive introuvable." },
          { status: 404 },
        );
      return NextResponse.json(row);
    }

    const where = [];
    const params = [];
    if (category) {
      where.push("hardware_category = ?");
      params.push(category);
    }
    if (search) {
      where.push(
        "(client_name LIKE ? OR client_phone LIKE ? OR ticket_id LIKE ?)",
      );
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    let sql = "SELECT * FROM archives";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY archived_at DESC";

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

// Archive a ticket (dev fallback) — moves a Delivered ticket to `archives` table
export async function POST(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const ticketId = url.searchParams.get("id");
  if (!ticketId)
    return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    // If the ticket is already archived, return a clear conflict error
    const [existing] = await conn.query(
      "SELECT ticket_id FROM archives WHERE ticket_id = ?",
      [ticketId],
    );
    if (existing.length)
      return NextResponse.json(
        { error: "Ticket déjà archivé." },
        { status: 409 },
      );

    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [ticketId],
    );
    if (!rows.length) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Ticket introuvable." },
        { status: 404 },
      );
    }
    const ticket = rows[0];

    if (ticket.status !== "Delivered") {
      await conn.rollback();
      return NextResponse.json(
        { error: "Seuls les tickets 'Delivered' peuvent être archivés." },
        { status: 400 },
      );
    }

    await conn.query(
      `INSERT INTO archives (ticket_id, client_name, client_phone, client_email, hardware_category, brand, model, serial_number, problem_description, diagnostic_notes, technician_notes, status, location, estimated_cost, final_cost, priority, created_at, updated_at, delivered_at, archived_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        ticket.ticket_id,
        ticket.client_name,
        ticket.client_phone,
        ticket.client_email,
        ticket.hardware_category,
        ticket.brand,
        ticket.model,
        ticket.serial_number,
        ticket.problem_description,
        ticket.diagnostic_notes,
        ticket.technician_notes,
        ticket.status,
        ticket.location,
        ticket.estimated_cost,
        ticket.final_cost,
        ticket.priority,
        ticket.created_at,
        ticket.updated_at,
        ticket.delivered_at,
      ],
    );

    await conn.query("DELETE FROM tickets WHERE ticket_id = ?", [ticketId]);
    await conn.commit();

    return NextResponse.json({ success: true });
  } catch (err) {
    await conn.rollback();
    return NextResponse.json(
      { error: "Erreur lors de l'archivage." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
