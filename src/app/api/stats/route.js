import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Dev-only fallback: mirror php-api/api/stats.php
export async function GET() {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const conn = await pool.getConnection();
  try {
    const [statusRows] = await conn.query(
      "SELECT status, COUNT(*) as count FROM tickets GROUP BY status",
    );
    const by_status = {};
    for (const r of statusRows) by_status[r.status] = r.count;
    for (const s of [
      "Received",
      "Diagnostic",
      "In Progress",
      "Completed",
      "Delivered",
    ])
      if (!by_status[s]) by_status[s] = 0;

    const [categories] = await conn.query(
      "SELECT hardware_category, COUNT(*) as count FROM tickets GROUP BY hardware_category ORDER BY count DESC",
    );

    const [priorityRows] = await conn.query(
      "SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority",
    );
    const by_priority = {};
    for (const r of priorityRows) by_priority[r.priority] = r.count;

    const [recent] = await conn.query(
      "SELECT ticket_id, client_name, hardware_category, status, priority, created_at FROM tickets ORDER BY created_at DESC LIMIT 5",
    );

    const [[{ total_archived = 0 }]] = await conn.query(
      "SELECT COUNT(*) as total_archived FROM archives",
    );
    const [[{ today = 0 }]] = await conn.query(
      "SELECT COUNT(*) as today FROM tickets WHERE DATE(created_at) = CURDATE()",
    );

    const total_active = Object.values(by_status).reduce(
      (a, b) => a + (Number(b) || 0),
      0,
    );

    return NextResponse.json({
      total_active,
      today: Number(today) || 0,
      total_archived: Number(total_archived) || 0,
      by_status,
      by_category: categories,
      by_priority,
      recent,
    });
  } finally {
    conn.release();
  }
}
