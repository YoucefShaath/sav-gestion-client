import pool from "@/lib/db";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const ticketId = url.searchParams.get("id");
  if (!ticketId)
    return Response.json({ error: "ID ticket requis." }, { status: 400 });
  const conn = await pool.getConnection();
  try {
    // Check active tickets
    const [activeRows] = await conn.query(
      `SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, updated_at, estimated_cost FROM tickets WHERE ticket_id = ?`,
      [ticketId],
    );
    let ticket = activeRows[0];
    if (!ticket) {
      // Check archives
      const [archRows] = await conn.query(
        `SELECT ticket_id, client_name, hardware_category, brand, model, status, priority, created_at, delivered_at, final_cost, archived_at FROM archives WHERE ticket_id = ?`,
        [ticketId],
      );
      ticket = archRows[0];
      if (!ticket)
        return Response.json({ error: "Ticket introuvable." }, { status: 404 });
      ticket.archived = true;
    } else {
      ticket.archived = false;
    }
    // Fetch status history
    const [history] = await conn.query(
      `SELECT new_status, changed_at FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC`,
      [ticketId],
    );
    ticket.history = history;
    return Response.json(ticket);
  } finally {
    conn.release();
  }
}
