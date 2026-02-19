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
