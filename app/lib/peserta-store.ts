import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "./db";
import type { DataPeserta, Peserta } from "./peserta-types";

export async function semuaPeserta(): Promise<Peserta[]> {
  const [rows] = await db.query<(Peserta & RowDataPacket)[]>(
    "SELECT bib, nama, klub, kategori FROM peserta ORDER BY bib",
  );
  return rows;
}

export async function tambahPeserta(data: DataPeserta): Promise<Peserta> {
  const [result] = await db.execute<ResultSetHeader>(
    "INSERT INTO peserta (nama, klub, kategori) VALUES (?, ?, ?)",
    [data.nama, data.klub, data.kategori],
  );
  return { ...data, bib: result.insertId };
}

export async function ubahPeserta(
  bib: number,
  data: DataPeserta,
): Promise<Peserta | null> {
  const [rows] = await db.execute<(Peserta & RowDataPacket)[]>(
    "SELECT bib FROM peserta WHERE bib = ?",
    [bib],
  );
  if (rows.length === 0) return null;

  await db.execute(
    "UPDATE peserta SET nama = ?, klub = ?, kategori = ? WHERE bib = ?",
    [data.nama, data.klub, data.kategori, bib],
  );
  return { ...data, bib };
}

export async function hapusPeserta(bib: number): Promise<Peserta | null> {
  const [rows] = await db.execute<(Peserta & RowDataPacket)[]>(
    "SELECT bib, nama, klub, kategori FROM peserta WHERE bib = ?",
    [bib],
  );
  if (rows.length === 0) return null;

  await db.execute("DELETE FROM peserta WHERE bib = ?", [bib]);
  return rows[0];
}
