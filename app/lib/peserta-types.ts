export const KATEGORI = ["Pemula", "Junior", "Senior"];

export type DataPeserta = {
  nama: string;
  klub: string;
  kategori: string;
};

export type Peserta = DataPeserta & { bib: number };
