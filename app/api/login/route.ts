import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cariUser } from "../../lib/users-store";
import { buatSesi } from "../../lib/session";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  const user = username ? await cariUser(username) : null;
  const cocok = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!user || !cocok) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 },
    );
  }

  await buatSesi({
    userId: user.id,
    username: user.username,
    role: user.role,
  });
  return NextResponse.json({ ok: true });
}
