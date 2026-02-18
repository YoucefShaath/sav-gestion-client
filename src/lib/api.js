/**
 * API Client for SAV Backend
 * All calls to the PHP API go through here.
 */

// No need for API_BASE for Next.js API routes

async function request(endpoint, options = {}) {
  // Remove .php and use /api/ route
  let url = endpoint;
  if (url.endsWith(".php")) url = url.replace(".php", "");
  if (!url.startsWith("/api/")) url = "/api/" + url;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const res = await fetch(url, config);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(
      data.error || data.errors?.join(", ") || "Erreur API",
    );
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ── Tickets ──────────────────────────────────────────────────
export async function getTickets(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`tickets${query ? `?${query}` : ""}`);
}

export async function getTicket(id) {
  return request(`tickets?id=${encodeURIComponent(id)}`);
}

export async function createTicket(data) {
  return request("tickets", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTicket(id, data) {
  return request(`tickets?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateTicketStatus(id, data) {
  return request(`tickets?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTicket(id) {
  return request(`tickets?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ── Archives ─────────────────────────────────────────────────
export async function getArchives(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`archives${query ? `?${query}` : ""}`);
}

export async function archiveTicket(id) {
  return request(`archives?id=${encodeURIComponent(id)}`, {
    method: "POST",
  });
}

// ── Stats ────────────────────────────────────────────────────
export async function getStats() {
  return request("stats");
}

// ── Public Status ────────────────────────────────────────────
export async function getPublicStatus(id) {
  return request(`status?id=${encodeURIComponent(id)}`);
}

// ── Suggestions (model autocomplete) ────────────────────────
export async function getModelSuggestions(query, category = "") {
  const params = new URLSearchParams({ q: query });
  if (category) params.set("category", category);
  return request(`suggestions?${params.toString()}`);
}
