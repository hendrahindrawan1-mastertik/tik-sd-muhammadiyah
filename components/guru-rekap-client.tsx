"use client"

import { useState } from "react"
import { LogIn, CalendarDays, Users } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type BarisRekap = {
  nama: string
  kelas: string
  nisn: string
  jam: string
}

function tanggalHariIni() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function GuruRekapClient() {
  const [masuk, setMasuk] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [tanggal, setTanggal] = useState(tanggalHariIni())
  const [rekap, setRekap] = useState<BarisRekap[]>([])
  const [totalSiswa, setTotalSiswa] = useState<number | null>(null)
  const [memuatRekap, setMemuatRekap] = useState(false)

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
    muatRekap(tanggal)
  }

  const muatRekap = async (tgl: string) => {
    setMemuatRekap(true)
    const [{ data: rekapData, error: rekapError }, { count }] = await Promise.all([
      supabase.rpc("rekap_absensi_tanggal", { tgl }),
      supabase.from("siswa").select("*", { count: "exact", head: true }),
    ])
    setMemuatRekap(false)

    if (rekapError) {
      setError("Gagal memuat rekap: " + rekapError.message)
      return
    }

    setRekap(rekapData ?? [])
    setTotalSiswa(count ?? null)
  }

  const handleGantiTanggal = (tgl: string) => {
    setTanggal(tgl)
    muatRekap(tgl)
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

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="h-4 w-4 text-brand-blue" />
            Tanggal
          </label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => handleGantiTanggal(e.target.value)}
            className="rounded-xl border border-border px-4 py-2 text-sm outline-none focus:border-brand-blue"
          />
          {totalSiswa !== null && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eefbf1] px-3 py-1.5 text-sm font-semibold text-brand-green">
              <Users className="h-4 w-4" />
              {rekap.length} dari {totalSiswa} siswa hadir
            </span>
          )}
        </div>
          <div className="flex flex-wrap gap-4">
          <a
            href="/guru/kelola-tugas"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Kelola Tugas &rarr;
          </a>
          <a
            href="/guru/kelola-ulasan"
            className="text-sm font-semibold text-brand-blue hover:underline"
          >
            Kelola Ulasan Pengunjung &rarr;
          </a>
        </div>
      </div>

      {memuatRekap ? (
        <p className="text-brand-muted">Memuat data...</p>
      ) : rekap.length === 0 ? (
        <p className="text-brand-muted">Belum ada siswa yang absen pada tanggal ini.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">Kelas</th>
                <th className="px-4 py-3 font-semibold">NISN</th>
                <th className="px-4 py-3 font-semibold">Jam Absen</th>
              </tr>
            </thead>
            <tbody>
              {rekap.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3">{r.nama}</td>
                  <td className="px-4 py-3">{r.kelas}</td>
                  <td className="px-4 py-3">{r.nisn}</td>
                  <td className="px-4 py-3">{new Date(r.jam).toLocaleTimeString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}