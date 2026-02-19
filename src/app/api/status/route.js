import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Dev fallback for public status (GET ?id=...)
export async function GET(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const ticketId = url.searchParams.get("id");
  if (!ticketId)
    return NextResponse.json({ error: "ID ticket requis." }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, updated_at, estimated_cost FROM tickets WHERE ticket_id = ?",
      [ticketId],
    );
    let ticket = rows[0];
    if (!ticket) {
      const [archRows] = await conn.query(
        "SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, delivered_at, final_cost, archived_at FROM archives WHERE ticket_id = ?",
        [ticketId],
      );
      ticket = archRows[0];
      if (!ticket)
        return NextResponse.json(
          { error: "Ticket introuvable." },
          { status: 404 },
        );
      ticket.archived = true;
    } else {
      ticket.archived = false;
    }

    const [history] = await conn.query(
      "SELECT new_status, changed_at FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [ticketId],
    );
    ticket.history = history;
    return NextResponse.json(ticket);
  } finally {
    conn.release();
  }
}
