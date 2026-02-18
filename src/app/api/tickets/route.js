import pool from "@/lib/db";
import { TRANSITIONS, STATUS_LABELS } from "@/lib/utils";
import { sendMail } from "@/lib/mail";
import { renderInvoiceHtml } from "@/lib/invoice";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("id");
  const status = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  const priority = url.searchParams.get("priority");
  const search = url.searchParams.get("search");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") || "50"));
  const offset = (page - 1) * limit;

  const conn = await pool.getConnection();
  try {
    if (id) {
      // Single ticket
      const [rows] = await conn.query(
        "SELECT * FROM tickets WHERE ticket_id = ?",
        [id],
      );
      if (!rows.length)
        return Response.json({ error: "Ticket introuvable." }, { status: 404 });
      const ticket = rows[0];
      const [history] = await conn.query(
        "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
        [id],
      );
      ticket.history = history;
      return Response.json(ticket);
    }
    // List with filters
    let where = [];
    let params = [];
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
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    let sql = "SELECT * FROM tickets";
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql +=
      " ORDER BY FIELD(priority, 'Urgent','High','Normal','Low'), created_at DESC";
    // Count
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
  const data = await req.json();

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
  } = data || {};

  // Basic validation
  const errors = [];
  if (!client_name || !String(client_name).trim()) errors.push("client_name");
  if (!client_phone || !String(client_phone).trim())
    errors.push("client_phone");
  if (!hardware_category || !String(hardware_category).trim())
    errors.push("hardware_category");
  if (!brand || !String(brand).trim()) errors.push("brand");
  if (!problem_description || !String(problem_description).trim())
    errors.push("problem_description");

  if (errors.length) {
    return Response.json(
      { errors, error: "Champs obligatoires manquants." },
      { status: 422 },
    );
  }

  // Validate phone (simple digit check)
  const cleaned = String(client_phone).replace(/[^0-9\+]/g, "");
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return Response.json(
      { error: "Numéro de téléphone invalide." },
      { status: 422 },
    );
  }

  const conn = await pool.getConnection();
  try {
    // Generate ticket id SAV-YYMMDD-XXXX
    const prefix =
      "SAV-" +
      new Date().toISOString().slice(2, 10).replace(/-/g, "").slice(0, 6) +
      "-";
    const [last] = await conn.query(
      "SELECT ticket_id FROM tickets WHERE ticket_id LIKE ? ORDER BY id DESC LIMIT 1",
      [prefix + "%"],
    );
    let seq = 1;
    if (last.length) {
      const lastId = last[0].ticket_id;
      const n = parseInt(lastId.slice(-4), 10);
      if (!isNaN(n)) seq = n + 1;
    }
    const ticketId = prefix + String(seq).padStart(4, "0");

    // Insert ticket
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

    // Insert initial status history
    await conn.query(
      "INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, 'Received', NOW())",
      [ticketId],
    );

    // Return created ticket
    const [rows] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [ticketId],
    );
    const ticket = rows[0];
    const [history] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [ticketId],
    );
    if (ticket) ticket.history = history;

    return Response.json(ticket);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Erreur lors de la création du ticket." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}

export async function PUT(req) {
  return Response.json({ error: "Not implemented" }, { status: 501 });
}

export async function PATCH(req) {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "ID requis" }, { status: 400 });
  const data = await req.json();
  const newStatus = data.status;
  if (!newStatus)
    return Response.json({ error: "Nouveau statut requis" }, { status: 400 });

  // Normalize incoming status to canonical keys (accept French labels)
  const invertLabels = Object.fromEntries(
    Object.entries(STATUS_LABELS).map(([k, v]) => [v, k]),
  );
  function normalize(s) {
    if (!s) return s;
    if (TRANSITIONS[s]) return s; // already canonical
    if (invertLabels[s]) return invertLabels[s]; // french -> canonical
    return s;
  }

  const canonicalNew = normalize(newStatus);

  // Use centralized TRANSITIONS map
  const allowed = TRANSITIONS;

  const conn = await pool.getConnection();
  try {
    // Get current status
    const [rows] = await conn.query(
      "SELECT status FROM tickets WHERE ticket_id = ?",
      [id],
    );
    if (!rows.length)
      return Response.json({ error: "Ticket introuvable." }, { status: 404 });
    const currentStatusCanonical = normalize(rows[0].status) || rows[0].status;
    if (
      !allowed[currentStatusCanonical] ||
      !allowed[currentStatusCanonical].includes(canonicalNew)
    ) {
      return Response.json(
        { error: `Transition invalide: ${rows[0].status} → ${newStatus}` },
        { status: 400 },
      );
    }
    // Update ticket (store canonical status)
    await conn.query(
      "UPDATE tickets SET status = ?, updated_at = NOW() WHERE ticket_id = ?",
      [canonicalNew, id],
    );
    // Log status history (store canonical)
    await conn.query(
      "INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, ?, NOW())",
      [id, canonicalNew],
    );

    // Return updated ticket with history (same shape as GET single)
    const [updatedRows] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [id],
    );
    const ticket = updatedRows[0] || null;
    const [historyRows] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [id],
    );
    if (ticket) ticket.history = historyRows;

    // If ticket moved to Completed, notify the client by email (if email available).
    // This is intentionally non-blocking for the API behaviour — we await the
    // helper but do not fail the request if email sending fails.
    if (
      canonicalNew === "Completed" &&
      ticket &&
      ticket.client_email &&
      process.env.EMAIL_ON_COMPLETED !== "false"
    ) {
      try {
        const origin =
          url.origin ||
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.APP_URL ||
          "http://localhost";
        const trackUrl = `${origin.replace(/\/$/, "")}/track/${ticket.ticket_id}`;
        const subject = `Votre réparation (${ticket.ticket_id}) est prête`;

        // Render invoice HTML on the server and include it in the email body
        const invoiceHtml = renderInvoiceHtml(ticket, origin);

        const preamble = `<p>Bonjour ${ticket.client_name || "client"},</p>
          <p>Votre appareil pris en charge sous le numéro <strong>${ticket.ticket_id}</strong> est désormais <strong>terminé</strong>. Vous trouverez ci-dessous la facture correspondante et vous pouvez également la consulter en ligne : <a href="${trackUrl}">${trackUrl}</a></p>`;

        const combinedHtml = preamble + invoiceHtml;

        // Attach the same invoice HTML so the client can download it easily from the message
        const invoiceFilename = `FAC-${(ticket.ticket_id || "").replace("SAV-", "")}.html`;
        const result = await sendMail({
          to: ticket.client_email,
          subject,
          html: combinedHtml,
          attachments: [
            {
              filename: invoiceFilename,
              content: invoiceHtml,
              contentType: "text/html",
            },
          ],
        });
        console.log("Status-change email (with invoice) result:", result);
      } catch (err) {
        console.error("Failed to send completion email:", err);
      }
    }

    return Response.json(ticket);
  } finally {
    conn.release();
  }
}

export async function DELETE(req) {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "ID requis" }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Ensure ticket exists
    const [rows] = await conn.query(
      "SELECT ticket_id FROM tickets WHERE ticket_id = ?",
      [id],
    );
    if (!rows.length) {
      await conn.rollback();
      return Response.json({ error: "Ticket introuvable." }, { status: 404 });
    }

    // Delete status history and the ticket itself
    await conn.query("DELETE FROM status_history WHERE ticket_id = ?", [id]);
    await conn.query("DELETE FROM tickets WHERE ticket_id = ?", [id]);

    await conn.commit();
    return Response.json({ success: true });
  } catch (err) {
    await conn.rollback();
    console.error("Delete ticket error:", err);
    return Response.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
