"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="p-8">
      <h2 className="text-xl font-bold">Terjadi kesalahan</h2>
      <p className="mt-2">
        Data peserta tidak dapat dimuat. Pastikan database menyala, lalu coba
        lagi.
      </p>
      <button className="border p-2 mt-4" onClick={() => unstable_retry()}>
        Coba lagi
      </button>
    </main>
  );
}
