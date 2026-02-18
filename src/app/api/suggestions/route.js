import pool from "@/lib/db";

export async function GET(req) {
  const url = new URL(req.url, "http://localhost");
  const category = url.searchParams.get("category") || "";
  const q = (url.searchParams.get("q") || "").trim();
  const field = url.searchParams.get("field") || "model";
  if (!q) return Response.json([]);
  const conn = await pool.getConnection();
  try {
    if (field === "brand") {
      const [rows] = await conn.query(
        `SELECT DISTINCT brand FROM tickets WHERE brand IS NOT NULL AND brand != '' AND brand LIKE ?
         UNION
         SELECT DISTINCT brand FROM archives WHERE brand IS NOT NULL AND brand != '' AND brand LIKE ?
         ORDER BY brand ASC LIMIT 15`,
        [`%${q}%`, `%${q}%`],
      );
      return Response.json(rows.map((r) => r.brand));
    }
    // Default: suggest models
    let catFilter1 = category ? "AND hardware_category = ?" : "";
    let catFilter2 = category ? "AND hardware_category = ?" : "";
    // params for (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) in first SELECT, then same for second SELECT
    let params = [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`];
    if (category) params.push(category, category);
    const [rows] = await conn.query(
      `SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model
       FROM tickets WHERE model IS NOT NULL AND model != '' AND (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) ${catFilter1}
       UNION
       SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model
       FROM archives WHERE model IS NOT NULL AND model != '' AND (model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?) ${catFilter2}
       ORDER BY suggestion ASC LIMIT 15`,
      params,
    );

    // Fallback: if no exact/combined matches, try tokenized (any-token) search so queries like
    // "hp pavillon 15" still match records containing 'HP' and '15'. This is a permissive fallback.
    if (!rows.length) {
      const tokens = q.split(/\s+/).filter(Boolean).slice(0, 4); // limit tokens
      if (tokens.length) {
        const tokenConds = tokens
          .map(
            () =>
              "(model LIKE ? OR brand LIKE ? OR CONCAT(brand,' ',model) LIKE ?)",
          )
          .join(" OR ");
        const tokenParams = tokens.flatMap((t) => [
          `%${t}%`,
          `%${t}%`,
          `%${t}%`,
        ]);
        const fallbackSql = `SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model
          FROM tickets WHERE model IS NOT NULL AND model != '' AND (${tokenConds}) ${catFilter1}
          UNION
          SELECT DISTINCT CONCAT(COALESCE(brand,''), ' ', COALESCE(model,'')) AS suggestion, brand, model
          FROM archives WHERE model IS NOT NULL AND model != '' AND (${tokenConds}) ${catFilter2}
          ORDER BY suggestion ASC LIMIT 15`;
        const [fallbackRows] = await conn.query(fallbackSql, [
          ...tokenParams,
          ...(category ? [category, category] : []),
          ...tokenParams,
          ...(category ? [category, category] : []),
        ]);
        return Response.json(fallbackRows);
      }
    }
    return Response.json(rows);
  } finally {
    conn.release();
  }
}
