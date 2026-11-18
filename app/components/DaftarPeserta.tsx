"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import KartuPeserta from "./KartuPeserta";
import { KATEGORI, type DataPeserta, type Peserta } from "../lib/peserta-types";
import { inputGaya, tombolEmas } from "../lib/ui";

const FORM_KOSONG: DataPeserta = { nama: "", klub: "", kategori: KATEGORI[0] };

export default function DaftarPeserta({
  awal,
  username,
}: {
  awal: Peserta[];
  username: string;
}) {
  const router = useRouter();
  const [peserta, setPeserta] = useState<Peserta[]>(awal);
  const [form, setForm] = useState<DataPeserta>(FORM_KOSONG);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState("");
  const [cari, setCari] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  useEffect(() => {
    if (!sukses) return;
    const timer = setTimeout(() => setSukses(""), 3000);
    return () => clearTimeout(timer);
  }, [sukses]);

  async function tambah() {
    if (!form.nama.trim()) {
      setSukses("");
      setError("Nama tidak boleh kosong");
      return;
    }

    try {
      const res = await fetch("/api/peserta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nama: form.nama.trim(),
          klub: form.klub.trim(),
        }),
      });
      if (!res.ok) throw new Error();

      const baru: Peserta = await res.json();
      setError("");
      setPeserta([...peserta, baru]);
      setSukses(`${baru.nama} berhasil ditambahkan dengan BIB ${baru.bib}`);
      setForm(FORM_KOSONG);
      setCari("");
      setFilterKategori("Semua");
    } catch {
      setSukses("");
      setError("Gagal menambah peserta");
    }
  }

  async function hapus(bib: number) {
    try {
      const res = await fetch(`/api/peserta/${bib}`, { method: "DELETE" });
      if (!res.ok) throw new Error();

      const dihapus: Peserta = await res.json();
      setPeserta(peserta.filter((p) => p.bib !== bib));
      setError("");
      setSukses(`${dihapus.nama} berhasil dihapus`);
    } catch {
      setSukses("");
      setError("Gagal menghapus peserta");
    }
  }

  async function ubah(bib: number, data: DataPeserta) {
    try {
      const res = await fetch(`/api/peserta/${bib}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          nama: data.nama.trim(),
          klub: data.klub.trim(),
        }),
      });
      if (!res.ok) throw new Error();

      const hasil: Peserta = await res.json();
      setPeserta(peserta.map((p) => (p.bib === bib ? hasil : p)));
      setError("");
      setSukses(`${hasil.nama} berhasil diperbarui`);
    } catch {
      setSukses("");
      setError("Gagal memperbarui peserta");
    }
  }

  async function keluar() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const kataKunci = cari.trim().toLowerCase();
  const tampil = peserta.filter((p) => {
    const cocokKategori =
      filterKategori === "Semua" || p.kategori === filterKategori;
    const cocokCari =
      !kataKunci ||
      p.nama.toLowerCase().includes(kataKunci) ||
      p.klub.toLowerCase().includes(kataKunci) ||
      String(p.bib).includes(kataKunci);
    return cocokKategori && cocokCari;
  });

  return (
    <div className="min-h-screen">
      <header className="bg-navy-900 text-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold tracking-wide text-gold-400">
              Daftar Peserta
            </h1>
            <p className="text-sm text-white/70">
              Masuk sebagai <strong className="text-white">{username}</strong>
            </p>
          </div>
          <button
            className="rounded-lg border border-gold-500 px-3 py-1.5 text-sm font-medium text-gold-400 transition-colors hover:bg-gold-500 hover:text-navy-900"
            onClick={keluar}
          >
            Keluar
          </button>
        </div>
        <div className="h-1 bg-gold-500" />
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <section className="rounded-xl border border-navy-900/10 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-navy-900">Tambah peserta</h2>
          <div className="flex flex-wrap gap-2">
            <input
              className={`${inputGaya} min-w-40 flex-1`}
              placeholder="Nama peserta"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
            <input
              className={`${inputGaya} min-w-40 flex-1`}
              placeholder="Klub"
              value={form.klub}
              onChange={(e) => setForm({ ...form, klub: e.target.value })}
            />
            <select
              className={inputGaya}
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            >
              {KATEGORI.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button className={tombolEmas} onClick={tambah}>
              Tambah
            </button>
          </div>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {sukses && (
            <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {sukses}
            </p>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <input
              className={`${inputGaya} min-w-48 flex-1`}
              placeholder="Cari nama, klub, atau BIB"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />
            <select
              className={inputGaya}
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
            >
              <option value="Semua">Semua kategori</option>
              {KATEGORI.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-slate-600">
            Menampilkan {tampil.length} dari {peserta.length} peserta
          </p>

          <div className="space-y-2">
            {tampil.length === 0 && (
              <p className="rounded-xl border border-dashed border-navy-900/20 bg-white p-6 text-center text-slate-500">
                Tidak ada peserta yang cocok.
              </p>
            )}
            {tampil.map((p) => (
              <KartuPeserta
                key={p.bib}
                peserta={p}
                onHapus={() => hapus(p.bib)}
                onSimpan={(data) => ubah(p.bib, data)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
