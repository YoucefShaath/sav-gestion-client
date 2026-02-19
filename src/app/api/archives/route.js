import pool from "@/lib/db";
import { NextResponse } from "next/server";

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
