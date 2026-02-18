import pool from "@/lib/db";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const ticketId = url.searchParams.get("ticket_id");
  if (!ticketId)
    return Response.json({ error: "ID ticket requis." }, { status: 400 });
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [ticketId],
    );
    return Response.json(rows);
  } finally {
    conn.release();
  }
}
