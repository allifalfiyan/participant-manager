import type { RowDataPacket } from "mysql2";
import { db } from "./db";

export type User = {
  id: number;
  username: string;
  password_hash: string;
  role: string;
};

export async function cariUser(username: string): Promise<User | null> {
  const [rows] = await db.execute<(User & RowDataPacket)[]>(
    "SELECT id, username, password_hash, role FROM users WHERE username = ?",
    [username],
  );
  return rows[0] ?? null;
}
