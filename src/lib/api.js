/**
 * API Client for SAV Backend
 * All calls to the PHP API go through here.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(endpoint, options = {}) {
  const url = `${API_BASE}/${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const res = await fetch(url, config);
  const data = await res.json();

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
  return request(`tickets.php${query ? `?${query}` : ""}`);
}

export async function getTicket(id) {
  return request(`tickets.php?id=${encodeURIComponent(id)}`);
}

export async function createTicket(data) {
  return request("tickets.php", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTicket(id, data) {
  return request(`tickets.php?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function updateTicketStatus(id, data) {
  return request(`tickets.php?id=${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTicket(id) {
  return request(`tickets.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ── Archives ─────────────────────────────────────────────────
export async function getArchives(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`archives.php${query ? `?${query}` : ""}`);
}

export async function archiveTicket(id) {
  return request(`archives.php?id=${encodeURIComponent(id)}`, {
    method: "POST",
  });
}

// ── Stats ────────────────────────────────────────────────────
export async function getStats() {
  return request("stats.php");
}

// ── Public Status ────────────────────────────────────────────
export async function getPublicStatus(id) {
  return request(`status.php?id=${encodeURIComponent(id)}`);
}

// ── Suggestions (model autocomplete) ────────────────────────
export async function getModelSuggestions(query, category = "") {
  const params = new URLSearchParams({ q: query });
  if (category) params.set("category", category);
  return request(`suggestions.php?${params.toString()}`);
}
