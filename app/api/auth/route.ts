import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password } = body;

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!validUsername || !validPassword || !secret) {
    return Response.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (username !== validUsername || password !== validPassword) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = Buffer.from(`${secret}:${Date.now()}`).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return Response.json({ success: true });
}
