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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Erreur de connexion");
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
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur");
  return data.data || data;
}

export async function lookupTicketById(ticketId) {
  return getPublicStatus(ticketId);
}
