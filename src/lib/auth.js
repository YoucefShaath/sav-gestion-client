/**
 * Auth API + helpers
 */
import { getPublicStatus } from "./api";

// No need for API_BASE for Next.js API routes

export async function loginTechnician(username, password) {
  const res = await fetch(`/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  // Try to parse JSON, but fall back to text when server returns HTML/plain-text errors
  let data;
  let text;
  try {
    data = await res.json();
  } catch (err) {
    text = await res.text();
  }

  if (!res.ok) {
    const message = (data && (data.error || data.message)) || text || `Erreur de connexion (${res.status})`;
    throw new Error(message);
  }

  if (!data) {
    // successful HTTP status but non-JSON body — surface raw text
    throw new Error(text || "Réponse inattendue du serveur");
  }

  // Store session
  if (typeof window !== "undefined") {
    localStorage.setItem("sav_token", data.token);
    localStorage.setItem("sav_user", JSON.stringify(data.user));
  }

  return data;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sav_token");
    localStorage.removeItem("sav_user");
  }
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("sav_token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  try {
    const user = localStorage.getItem("sav_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

/**
 * Lookup tickets by phone number (for user "my tickets" feature)
 */
export async function lookupTicketsByPhone(phone) {
  const res = await fetch(`/api/tickets?search=${encodeURIComponent(phone)}`);

  let data;
  let text;
  try {
    data = await res.json();
  } catch (err) {
    text = await res.text();
  }

  if (!res.ok) throw new Error((data && (data.error || data.message)) || text || `Erreur (${res.status})`);
  return data.data || data;
}

export async function lookupTicketById(ticketId) {
  return getPublicStatus(ticketId);
}
