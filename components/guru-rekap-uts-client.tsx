"use client"

import { useEffect, useState } from "react"
import { LogIn, Trash2, RefreshCw } from "lucide-react"
import { supabase, type HasilUTS } from "@/lib/supabase/client"

export function GuruRekapUTSClient() {
  const [masuk, setMasuk] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorLogin, setErrorLogin] = useState<string | null>(null)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [kelas, setKelas] = useState<4 | 5 | 6>(4)
  const [daftar, setDaftar] = useState<HasilUTS[]>([])
  const [memuat, setMemuat] = useState(false)

  const muatDaftar = async (k: 4 | 5 | 6) => {
    setMemuat(true)
    const { data } = await supabase
      .from("hasil_uts")
      .select("*")
      .eq("kelas", k)
      .order("created_at", { ascending: false })
    setDaftar(data ?? [])
    setMemuat(false)
  }

  useEffect(() => {
    if (masuk) muatDaftar(kelas)
  }, [masuk, kelas])

  const handleLogin = async () => {
    setErrorLogin(null)
    setLoadingLogin(true)
    const { data, error } = await supabase.rpc("verify_guru_login", {
      u: username.trim(),
      pw: password,
    })
    setLoadingLogin(false)
    if (error || !data) {
      setErrorLogin("Username atau password salah")
      return
    }
    setMasuk(true)
  }

  const hapusHasil = async (id: string) => {
    if (!confirm("Hapus nilai ini? Siswa akan bisa mengerjakan UTS ulang setelah dihapus.")) return
    await supabase.from("hasil_uts").delete().eq("id", id)
    muatDaftar(kelas)
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

        {errorLogin && <p className="mb-4 text-sm text-red-500">{errorLogin}</p>}

        <button
          disabled={loadingLogin}
          onClick={handleLogin}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          <LogIn className="h-4 w-4" />
          {loadingLogin ? "Memeriksa..." : "Masuk"}
        </button>
      </div>
    )
  }

  const rataRata =
    daftar.length > 0
      ? (
          daftar.reduce((sum, d) => sum + (d.skor / d.total_soal) * 100, 0) / daftar.length
        ).toFixed(1)
      : "0"

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="text-sm font-semibold">Kelas:</label>
        <select
          value={kelas}
          onChange={(e) => setKelas(Number(e.target.value) as 4 | 5 | 6)}
          className="rounded-xl border border-border px-4 py-2 text-sm outline-none focus:border-brand-blue"
        >
          <option value={4}>Kelas 4</option>
          <option value={5}>Kelas 5</option>
          <option value={6}>Kelas 6</option>
        </select>
        {daftar.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eefbf1] px-3 py-1.5 text-sm font-semibold text-brand-green">
            {daftar.length} siswa &middot; rata-rata {rataRata}
          </span>
        )}
        <button
          onClick={() => muatDaftar(kelas)}
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-brand-blue hover:underline"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Muat Ulang
        </button>
      </div>

      {memuat ? (
        <p className="text-brand-muted">Memuat data...</p>
      ) : daftar.length === 0 ? (
        <p className="text-brand-muted">Belum ada siswa yang mengerjakan UTS kelas ini.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama</th>
                <th className="px-4 py-3 font-semibold">NISN</th>
                <th className="px-4 py-3 font-semibold">Benar</th>
                <th className="px-4 py-3 font-semibold">Nilai</th>
                <th className="px-4 py-3 font-semibold">Waktu Selesai</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-4 py-3">{d.nama_siswa}</td>
                  <td className="px-4 py-3">{d.nisn}</td>
                  <td className="px-4 py-3">
                    {d.skor}/{d.total_soal}
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-blue">
                    {Math.round((d.skor / d.total_soal) * 100)}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(d.created_at).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => hapusHasil(d.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
