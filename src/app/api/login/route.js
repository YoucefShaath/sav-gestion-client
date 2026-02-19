import { NextResponse } from "next/server";

export const dynamic = "force-static";

// Lightweight fallback for local dev: mirror php-api/api/login.php behaviour
const USERS = [
  {
    username: "admin",
    password: "admin123",
    name: "Administrateur",
    role: "admin",
  },
  {
    username: "tech1",
    password: "tech123",
    name: "Technicien 1",
    role: "technician",
  },
  {
    username: "tech2",
    password: "tech123",
    name: "Technicien 2",
    role: "technician",
  },
];

export async function POST(req) {
  try {
    const data = await req.json();
    const username = String(data.username || "").trim();
    const password = String(data.password || "").trim();

    const found = USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!found) {
      return NextResponse.json(
        { error: "Identifiants incorrects." },
        { status: 401 },
      );
    }

    const token = `dev-${Math.random().toString(36).slice(2, 10)}`;
    return NextResponse.json({
      success: true,
      token,
      user: { username: found.username, name: found.name, role: found.role },
    });
  } catch (err) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
