import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET belum diisi di .env.local");
}

const kunci = new TextEncoder().encode(process.env.SESSION_SECRET);
const NAMA_COOKIE = "sesi";

export type Sesi = { userId: number; username: string; role: string };

export async function buatSesi(data: Sesi) {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(kunci);

  const cookieStore = await cookies();
  cookieStore.set(NAMA_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function ambilSesi(): Promise<Sesi | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(NAMA_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, kunci);
    return {
      userId: Number(payload.userId),
      username: String(payload.username),
      role: String(payload.role),
    };
  } catch {
    return null; // token palsu, rusak, atau kedaluwarsa
  }
}

export async function hapusSesi() {
  const cookieStore = await cookies();
  cookieStore.delete(NAMA_COOKIE);
}
