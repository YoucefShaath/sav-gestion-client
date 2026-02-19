import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { renderInvoiceHtml } from "@/lib/invoice";
import path from "path";

export const dynamic = "force-static";

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

export async function POST(req) {
  // Dev-only createTicket fallback (mirrors php-api/api/tickets.php)
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

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
  } = body;

  // Basic validation (same rules as php-api)
  const errors = [];
  if (!client_name || !String(client_name).trim()) errors.push("client_name");
  if (!client_phone || !String(client_phone).trim())
    errors.push("client_phone");
  if (!hardware_category || !String(hardware_category).trim())
    errors.push("hardware_category");
  if (!brand || !String(brand).trim()) errors.push("brand");
  if (!problem_description || !String(problem_description).trim())
    errors.push("problem_description");
  if (errors.length)
    return NextResponse.json(
      { errors, error: "Champs obligatoires manquants." },
      { status: 422 },
    );

  // reuse client-side phone validator
  const { validatePhone } = await import("@/lib/utils");
  if (!validatePhone(client_phone))
    return NextResponse.json(
      { error: "Numéro de téléphone invalide." },
      { status: 422 },
    );

  const conn = await pool.getConnection();
  try {
    // Generate ticket id SAV-YYMMDD-XXXX
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const prefix = `SAV-${yy}${mm}${dd}-`;

    const [[last]] = await conn.query(
      "SELECT ticket_id FROM tickets WHERE ticket_id LIKE ? ORDER BY id DESC LIMIT 1",
      [prefix + "%"],
    );
    let seq = 1;
    if (last && last.ticket_id) {
      const n = parseInt(last.ticket_id.slice(-4), 10);
      if (n) seq = n + 1;
    }
    const ticketId = prefix + String(seq).padStart(4, "0");

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

    await conn.query(
      "INSERT INTO status_history (ticket_id, new_status, changed_at) VALUES (?, ?, NOW())",
      [ticketId, "Received"],
    );

    const [[ticket]] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [ticketId],
    );
    const [history] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [ticketId],
    );
    ticket.history = history;

    return NextResponse.json(ticket);
  } catch (err) {
    console.error("dev /api/tickets POST error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la création du ticket." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}

// ── Dev-only update (PUT), status change (PATCH) and delete (DELETE) handlers ──
export async function PUT(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });

  const allowed = [
    "client_name",
    "client_phone",
    "client_email",
    "hardware_category",
    "brand",
    "model",
    "serial_number",
    "problem_description",
    "diagnostic_notes",
    "technician_notes",
    "estimated_cost",
    "final_cost",
    "priority",
    "location",
  ];

  const sets = [];
  const params = [];
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(body, k)) {
      sets.push(`${k} = ?`);
      params.push(body[k] ?? null);
    }
  }

  if (sets.length === 0)
    return NextResponse.json(
      { error: "Aucune donnée à mettre à jour" },
      { status: 400 },
    );

  if (body.client_phone) {
    const { validatePhone } = await import("@/lib/utils");
    if (!validatePhone(body.client_phone))
      return NextResponse.json(
        { error: "Numéro de téléphone invalide." },
        { status: 422 },
      );
  }

  params.push(id);
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `UPDATE tickets SET ${sets.join(", ")}, updated_at = NOW() WHERE ticket_id = ?`,
      params,
    );
    const [[ticket]] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [id],
    );
    const [history] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [id],
    );
    ticket.history = history;
    return NextResponse.json(ticket);
  } catch (err) {
    console.error("dev /api/tickets PUT error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  } finally {
    conn.release();
  }
}

export async function PATCH(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body || !body.status)
    return NextResponse.json(
      { error: "Nouveau statut requis" },
      { status: 400 },
    );
  const newStatus = body.status;

  const { TRANSITIONS } = await import("@/lib/utils");
  const conn = await pool.getConnection();
  try {
    const [[row]] = await conn.query(
      "SELECT status, client_email, client_name FROM tickets WHERE ticket_id = ?",
      [id],
    );
    if (!row)
      return NextResponse.json(
        { error: "Ticket introuvable." },
        { status: 404 },
      );
    const current = row.status;

    const allowed = TRANSITIONS[current] || [];
    if (!allowed.includes(newStatus))
      return NextResponse.json(
        { error: `Transition invalide: ${current} → ${newStatus}` },
        { status: 400 },
      );

    await conn.beginTransaction();
    await conn.query(
      "UPDATE tickets SET status = ?, updated_at = NOW() WHERE ticket_id = ?",
      [newStatus, id],
    );
    await conn.query(
      "INSERT INTO status_history (ticket_id, old_status, new_status, changed_at) VALUES (?, ?, ?, NOW())",
      [id, current, newStatus],
    );
    await conn.commit();

    // If moved to Completed, send the client an email (dev mirrors php-api behavior).
    // Uses server-side `renderInvoiceHtml` + `sendMail` (sendMail simulates send in dev when SMTP not configured).
    if (
      newStatus === "Completed" &&
      row.client_email &&
      process.env.EMAIL_ON_COMPLETED !== "false"
    ) {
      try {
        const [[ticketForEmail]] = await conn.query(
          "SELECT * FROM tickets WHERE ticket_id = ?",
          [id],
        );
        const origin =
          process.env.NEXT_PUBLIC_APP_URL ||
          process.env.APP_URL ||
          "http://localhost:3000";
        const trackUrl = `${origin.replace(/\/$/, "")}/track/${ticketForEmail.ticket_id}`;
        const subject = `Votre réparation (${ticketForEmail.ticket_id}) est prête`;
        const logoCid = "logo@informaticacompany.com";

        const invoiceHtml = renderInvoiceHtml(
          ticketForEmail,
          origin,
          `cid:${logoCid}`,
        );
        const preamble = `<p>Bonjour ${ticketForEmail.client_name || "client"},</p><p>Votre appareil pris en charge sous le numéro <strong>${ticketForEmail.ticket_id}</strong> est désormais <strong>terminé</strong>. Vous pouvez consulter le suivi en ligne : <a href="${trackUrl}">${trackUrl}</a></p>`;
        const combinedHtml = preamble + invoiceHtml;

        const result = await sendMail({
          to: ticketForEmail.client_email,
          subject,
          html: combinedHtml,
          attachments: [
            {
              filename: "logo.jpg",
              path: path.join(process.cwd(), "public", "logo.jpg"),
              cid: logoCid,
            },
          ],
        });
        console.log("Completion email result:", result);
      } catch (err) {
        console.error("Failed to send completion email (dev):", err);
      }
    }

    const [[ticket]] = await conn.query(
      "SELECT * FROM tickets WHERE ticket_id = ?",
      [id],
    );
    const [history] = await conn.query(
      "SELECT * FROM status_history WHERE ticket_id = ? ORDER BY changed_at ASC",
      [id],
    );
    ticket.history = history;
    return NextResponse.json(ticket);
  } catch (err) {
    try {
      await conn.rollback();
    } catch (e) {}
    console.error("dev /api/tickets PATCH error:", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  } finally {
    conn.release();
  }
}

export async function DELETE(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[exists]] = await conn.query(
      "SELECT ticket_id FROM tickets WHERE ticket_id = ?",
      [id],
    );
    if (!exists) {
      await conn.rollback();
      return NextResponse.json(
        { error: "Ticket introuvable." },
        { status: 404 },
      );
    }
    await conn.query("DELETE FROM status_history WHERE ticket_id = ?", [id]);
    await conn.query("DELETE FROM tickets WHERE ticket_id = ?", [id]);
    await conn.commit();
    return NextResponse.json({ success: true });
  } catch (err) {
    try {
      await conn.rollback();
    } catch (e) {}
    console.error("dev /api/tickets DELETE error:", err);
    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 },
    );
  } finally {
    conn.release();
  }
}
