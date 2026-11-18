"use client";

import { useState } from "react";
import { KATEGORI, type DataPeserta, type Peserta } from "../lib/peserta-types";
import { inputGaya, tombolEmas, tombolGaris, tombolBahaya } from "../lib/ui";

type Props = {
  peserta: Peserta;
  onHapus: () => void;
  onSimpan: (data: DataPeserta) => void;
};

export default function KartuPeserta({ peserta, onHapus, onSimpan }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<DataPeserta>({
    nama: peserta.nama,
    klub: peserta.klub,
    kategori: peserta.kategori,
  });
  const [pesan, setPesan] = useState("");

  function mulaiEdit() {
    setForm({
      nama: peserta.nama,
      klub: peserta.klub,
      kategori: peserta.kategori,
    });
    setPesan("");
    setEditing(true);
  }

  function simpan() {
    if (!form.nama.trim()) {
      setPesan("Nama tidak boleh kosong");
      return; // tetap di mode edit sampai nama valid
    }
    onSimpan(form);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-3 rounded-xl border border-gold-500 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <input
            className={`${inputGaya} min-w-40 flex-1`}
            placeholder="Nama"
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
        </div>
        {pesan && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {pesan}
          </p>
        )}
        <div className="flex gap-2">
          <button className={`${tombolEmas} py-1.5 text-sm`} onClick={simpan}>
            Simpan
          </button>
          <button className={tombolGaris} onClick={() => setEditing(false)}>
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-l-4 border-navy-900/10 border-l-gold-500 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-lg font-bold text-gold-400">
          {peserta.bib}
        </div>
        <div>
          <h3 className="font-semibold text-navy-900">{peserta.nama}</h3>
          <p className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>{peserta.klub || "Tanpa klub"}</span>
            <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-xs font-semibold text-gold-600 ring-1 ring-gold-500/40">
              {peserta.kategori}
            </span>
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className={tombolGaris} onClick={mulaiEdit}>
          Edit
        </button>
        <button className={tombolBahaya} onClick={onHapus}>
          Hapus
        </button>
      </div>
    </div>
  );
}
