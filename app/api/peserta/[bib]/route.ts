import { NextResponse } from "next/server";
import { hapusPeserta, ubahPeserta } from "../../../lib/peserta-store";
import { ambilSesi } from "../../../lib/session";
import { KATEGORI } from "../../../lib/peserta-types";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bib: string }> },
) {
  if (!(await ambilSesi())) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }
  const { bib } = await params;
  const dihapus = await hapusPeserta(Number(bib));

  if (!dihapus) {
    return NextResponse.json(
      { error: "Peserta tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(dihapus);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bib: string }> },
) {
  if (!(await ambilSesi())) {
    return NextResponse.json({ error: "Belum login" }, { status: 401 });
  }

  const { bib } = await params;
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

  const hasil = await ubahPeserta(Number(bib), { nama, klub, kategori });
  if (!hasil) {
    return NextResponse.json(
      { error: "Peserta tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(hasil);
}
