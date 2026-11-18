"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inputGaya, tombolEmas } from "../lib/ui";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function masuk() {
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Gagal masuk");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-sm rounded-2xl border-t-4 border-gold-500 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-navy-900">Masuk</h1>
        <p className="mb-6 mt-1 text-sm text-slate-600">
          Silakan login untuk mengelola data peserta.
        </p>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            masuk();
          }}
        >
          <input
            className={`${inputGaya} w-full`}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className={`${inputGaya} w-full`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={`${tombolEmas} w-full`} type="submit">
            Masuk
          </button>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
