import pool from "@/lib/db";

export async function GET() {
  const conn = await pool.getConnection();
  try {
    const [statusRows] = await conn.query(
      "SELECT status, COUNT(*) as count FROM tickets GROUP BY status",
    );
    const statusCounts = {};
    for (const row of statusRows) statusCounts[row.status] = row.count;
    for (const s of [
      "Received",
      "Diagnostic",
      "In Progress",
      "Completed",
      "Delivered",
    ]) {
      statusCounts[s] = statusCounts[s] || 0;
    }
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    const [categories] = await conn.query(
      "SELECT hardware_category, COUNT(*) as count FROM tickets GROUP BY hardware_category ORDER BY count DESC",
    );
    const [priorityRows] = await conn.query(
      "SELECT priority, COUNT(*) as count FROM tickets GROUP BY priority",
    );
    const priorities = {};
    for (const row of priorityRows) priorities[row.priority] = row.count;
    const [recent] = await conn.query(
      "SELECT ticket_id, client_name, hardware_category, status, priority, created_at FROM tickets ORDER BY created_at DESC LIMIT 5",
    );
    const [archivedRow] = await conn.query(
      "SELECT COUNT(*) as count FROM archives",
    );
    const archived = archivedRow[0]?.count || 0;
    const [todayRow] = await conn.query(
      "SELECT COUNT(*) as count FROM tickets WHERE DATE(created_at) = CURDATE()",
    );
    const today = todayRow[0]?.count || 0;
    return Response.json({
      total_active: total,
      today,
      total_archived: archived,
      by_status: statusCounts,
      by_category: categories,
      by_priority: priorities,
      recent,
    });
  } finally {
    conn.release();
  }
}
