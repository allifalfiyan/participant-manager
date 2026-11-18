import { Suspense } from "react";
import DaftarPeserta from "./components/DaftarPeserta";
import { semuaPeserta } from "./lib/peserta-store";
import { redirect } from "next/navigation";
import { ambilSesi } from "./lib/session";

async function DataPeserta() {
  const sesi = await ambilSesi();
  if (!sesi) redirect("/login");

  const rows = await semuaPeserta();
  const peserta = rows.map((p) => ({
    bib: p.bib,
    nama: p.nama,
    klub: p.klub,
    kategori: p.kategori,
  }));

  return <DaftarPeserta awal={peserta} username={sesi.username} />;
}

export default function Home() {
  return (
    <Suspense fallback={<p className="p-8">Memuat data...</p>}>
      <DataPeserta />
    </Suspense>
  );
}
