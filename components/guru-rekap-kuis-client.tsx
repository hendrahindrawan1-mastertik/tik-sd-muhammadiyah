"use client"

import { useState } from "react"
import { LogIn, ListChecks, Trophy } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type BarisHasil = {
  nama_siswa: string
  kelas: number
  skor: number
  total_soal: number
  created_at: string
}

export function GuruRekapKuisClient() {
  const [masuk, setMasuk] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [filterKelas, setFilterKelas] = useState<"" | "4" | "5" | "6">("")
  const [hasil, setHasil] = useState<BarisHasil[]>([])
  const [memuat, setMemuat] = useState(false)

  const handleLogin = async () => {
    setError(null)
    setLoading(true)
    const { data, error: err } = await supabase.rpc("verify_guru_login", {
      u: username.trim(),
      pw: password,
    })
    setLoading(false)

    if (err || !data) {
      setError("Username atau password salah")
      return
    }

    setMasuk(true)
    muatHasil("")
  }

  const muatHasil = async (kelas: "" | "4" | "5" | "6") => {
    setMemuat(true)
    const { data, error: rekapError } = await supabase.rpc("rekap_hasil_kuis", {
      filter_kelas: kelas === "" ? null : Number(kelas),
    })
    setMemuat(false)

    if (rekapError) {
      setError("Gagal memuat rekap: " + rekapError.message)
      return
    }
    setHasil(data ?? [])
  }

  const handleGantiFilter = (kelas: "" | "4" | "5" | "6") => {
    setFilterKelas(kelas)
    muatHasil(kelas)
  }

  if (!masuk) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-1 text-xl font-bold">Login Guru</h2>
        <p className="mb-5 text-sm text-brand-muted">Khusus untuk guru pengampu</p>

        <label className="mb-1.5 block text-sm font-semibold">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        <label className="mb-1.5 block text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          onClick={handleLogin}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          <LogIn className="h-4 w-4" />
          {loading ? "Memeriksa..." : "Masuk"}
        </button>
      </div>
    )
  }

  const rataRata =
    hasil.length > 0
      ? Math.round(
          (hasil.reduce((acc, h) => acc + (h.skor / h.total_soal) * 100, 0) / hasil.length) * 10
        ) / 10
      : null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <ListChecks className="h-4 w-4 text-brand-blue" />
            Filter Kelas
          </label>
          <select
            value={filterKelas}
            onChange={(e) => handleGantiFilter(e.target.value as "" | "4" | "5" | "6")}
            className="rounded-xl border border-border px-4 py-2 text-sm outline-none focus:border-brand-blue"
          >
            <option value="">Semua Kelas</option>
            <option value="4">Kelas 4</option>
            <option value="5">Kelas 5</option>
            <option value="6">Kelas 6</option>
          </select>
          {rataRata !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7df] px-3 py-1.5 text-sm font-semibold text-[#a3760a]">
              <Trophy className="h-4 w-4" />
              Rata-rata: {rataRata}%
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="/guru/rekap-absensi" className="text-sm font-semibold text-brand-blue hover:underline">
            Rekap Absensi &rarr;
          </a>
          <a href="/guru/kelola-tugas" className="text-sm font-semibold text-brand-blue hover:underline">
            Kelola Tugas &rarr;
          </a>
        </div>
      </div>

      {memuat ? (
        <p className="text-brand-muted">Memuat data...</p>
      ) : hasil.length === 0 ? (
        <p className="text-brand-muted">Belum ada siswa yang mengerjakan kuis.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                <th className="px-4 py-3 font-semibold">Kelas</th>
                <th className="px-4 py-3 font-semibold">Skor</th>
                <th className="px-4 py-3 font-semibold">Nilai</th>
                <th className="px-4 py-3 font-semibold">Waktu Mengerjakan</th>
              </tr>
            </thead>
            <tbody>
              {hasil.map((h, i) => {
                const nilai = Math.round((h.skor / h.total_soal) * 100)
                return (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-3">{h.nama_siswa}</td>
                    <td className="px-4 py-3">{h.kelas}</td>
                    <td className="px-4 py-3">
                      {h.skor} / {h.total_soal}
                    </td>
                    <td className="px-4 py-3 font-semibold">{nilai}</td>
                    <td className="px-4 py-3">
                      {new Date(h.created_at).toLocaleString("id-ID")}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
