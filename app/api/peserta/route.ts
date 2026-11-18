import { NextResponse } from "next/server";
import { semuaPeserta, tambahPeserta } from "../../lib/peserta-store";
import { ambilSesi } from "../../lib/session";
import { KATEGORI } from "../../lib/peserta-types";

export async function GET() {
  if (!(await ambilSesi())) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  return NextResponse.json(await semuaPeserta());
}

export async function POST(request: Request) {
  if (!(await ambilSesi())) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const body = await request.json();
  const nama = String(body.nama ?? "").trim();
  const klub = String(body.klub ?? "").trim();
  const kategori = String(body.kategori ?? KATEGORI[0]);

  if (!nama) {
    return NextResponse.json(
      { error: "Nama tidak boleh kosong" },
      { status: 400 },
    );
  }
  if (nama.length > 100 || klub.length > 100) {
    return NextResponse.json(
      { error: "Nama atau klub terlalu panjang" },
      { status: 400 },
    );
  }
  if (!KATEGORI.includes(kategori)) {
    return NextResponse.json(
      { error: "Kategori tidak valid" },
      { status: 400 },
    );
  }

  const baru = await tambahPeserta({ nama, klub, kategori });
  return NextResponse.json(baru, { status: 201 });
}
