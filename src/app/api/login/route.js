import { NextResponse } from "next/server";

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
  const { username, password } = await req.json();
  const user = USERS.find(
    (u) => u.username === username && u.password === password,
  );
  if (!user)
    return NextResponse.json(
      { error: "Identifiants incorrects." },
      { status: 401 },
    );
  // Generate a simple token (not secure, for demo only)
  const token = Math.random().toString(36).slice(2);
  return NextResponse.json({
    success: true,
    token,
    user: { username: user.username, name: user.name, role: user.role },
  });
}
