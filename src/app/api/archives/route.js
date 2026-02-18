import pool from "@/lib/db";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const ticketId = url.searchParams.get("id");
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));
  const offset = (page - 1) * limit;
  const conn = await pool.getConnection();
  try {
    if (ticketId) {
      const [rows] = await conn.query(
        "SELECT * FROM archives WHERE ticket_id = ?",
        [ticketId],
      );
      if (!rows.length)
        return Response.json(
          { error: "Archive introuvable." },
          { status: 404 },
        );
      return Response.json(rows[0]);
    }
    let where = [];
    let params = [];
    if (category) {
      where.push("hardware_category = ?");
      params.push(category);
    }
    if (search) {
      where.push(
        "(client_name LIKE ? OR client_phone LIKE ? OR ticket_id LIKE ?)",
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    let sql = "SELECT * FROM archives";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY archived_at DESC";
    const [countRows] = await conn.query(
      sql.replace("SELECT *", "SELECT COUNT(*) as total"),
      params,
    );
    const total = countRows[0]?.total || 0;
    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const [rows] = await conn.query(sql, params);
    return Response.json({
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
  const url = new URL(req.url, "http://localhost");
  const ticketId = url.searchParams.get("id");
  if (!ticketId) return Response.json({ error: "ID requis" }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Fetch ticket
    const [trows] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [ticketId],
    );
    if (!trows.length) {
      await conn.rollback();
      return Response.json({ error: "Ticket introuvable." }, { status: 404 });
    }
    const ticket = trows[0];

    // Only allow archiving if status is Delivered
    if (ticket.status !== "Delivered") {
      await conn.rollback();
      return Response.json(
        { error: "Seuls les tickets 'Delivered' peuvent être archivés." },
        { status: 400 },
      );
    }

    // Insert into archives
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

    // Remove from tickets
    await conn.query("DELETE FROM tickets WHERE ticket_id = ?", [ticketId]);

    await conn.commit();

    return Response.json({ success: true });
  } catch (err) {
    await conn.rollback();
    return Response.json(
      { error: "Erreur lors de l'archivage." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
