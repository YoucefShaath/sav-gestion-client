import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Dev fallback for suggestions (model / brand)
export async function GET(req) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 },
    );

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const category = url.searchParams.get("category") || null;
  const field = url.searchParams.get("field") || "model";
  if (!q) return NextResponse.json([]);

  const conn = await pool.getConnection();
  try {
    if (field === "brand") {
      const s = `%${q}%`;
      const sql = `SELECT DISTINCT brand FROM tickets WHERE brand IS NOT NULL AND brand != '' AND brand LIKE ? UNION SELECT DISTINCT brand FROM archives WHERE brand IS NOT NULL AND brand != '' AND brand LIKE ? ORDER BY brand ASC LIMIT 15`;
      const [rows] = await conn.query(sql, [s, s]);
      return NextResponse.json(rows.map((r) => r.brand));
    }

    // models
    const sq = `%${q}%`;
    let params = [sq, sq, sq];
    let catFilter = "";
    if (category) {
      catFilter = "AND hardware_category = ?";
      params.push(category);
    }

    const sql = `SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM tickets WHERE model IS NOT NULL AND model != '' AND (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) ${catFilter} UNION SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM archives WHERE model IS NOT NULL AND model != '' AND (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) ${catFilter} ORDER BY suggestion ASC LIMIT 15`;

    // build params for both unions
    const paramsFull = [sq, sq, sq];
    if (category) paramsFull.push(category);
    paramsFull.push(sq, sq, sq);
    if (category) paramsFull.push(category);

    const [rows] = await conn.query(sql, paramsFull);
    if (rows.length) return NextResponse.json(rows);

    // fallback tokenized search (simple)
    const tokens = q.split(/\s+/).filter(Boolean).slice(0, 4);
    if (tokens.length === 0) return NextResponse.json([]);

    const tokenConds = tokens
      .map(
        () =>
          `(model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ? )`,
      )
      .join(" OR ");
    const tokenParams = [];
    tokens.forEach((t) => tokenParams.push(`%${t}%`, `%${t}%`, `%${t}%`));
    let sql2 = `SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM tickets WHERE model IS NOT NULL AND model != '' AND (${tokenConds}) ${category ? "AND hardware_category = ?" : ""} UNION SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model FROM archives WHERE model IS NOT NULL AND model != '' AND (${tokenConds}) ${category ? "AND hardware_category = ?" : ""} ORDER BY suggestion ASC LIMIT 15`;
    const params2 = tokenParams.concat(tokenParams);
    if (category) {
      params2.push(category);
      params2.push(category);
    }
    const [rows2] = await conn.query(sql2, params2);
    return NextResponse.json(rows2);
  } finally {
    conn.release();
  }
}
