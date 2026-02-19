import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const ticketId = url.searchParams.get("ticket_id");
  if (!ticketId)
    return NextResponse.json({ error: "ID ticket requis." }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [ticketId],
    );
    return NextResponse.json(rows);
  } finally {
    conn.release();
  }
}
