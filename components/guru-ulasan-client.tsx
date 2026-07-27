"use client"

import { useState } from "react"
import { LogIn, Check, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type KomentarPending = {
  id: string
  nama: string
  isi: string
  created_at: string
}

export function GuruUlasanClient() {
  const [masuk, setMasuk] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [daftar, setDaftar] = useState<KomentarPending[]>([])
  const [memuat, setMemuat] = useState(false)
  const [memproses, setMemproses] = useState<string | null>(null)

  const muatPending = async () => {
    setMemuat(true)
    const { data } = await supabase.rpc("get_komentar_pending")
    setDaftar(data ?? [])
    setMemuat(false)
  }

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
    muatPending()
  }

  const setujui = async (id: string) => {
    setMemproses(id)
    await supabase.rpc("setujui_komentar", { komentar_id: id })
    setDaftar((prev) => prev.filter((k) => k.id !== id))
    setMemproses(null)
  }

  const hapus = async (id: string) => {
    setMemproses(id)
    await supabase.rpc("hapus_komentar", { komentar_id: id })
    setDaftar((prev) => prev.filter((k) => k.id !== id))
    setMemproses(null)
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

  if (memuat) {
    return <p className="text-brand-muted">Memuat ulasan yang menunggu persetujuan...</p>
  }

  if (daftar.length === 0) {
    return <p className="text-brand-muted">Tidak ada ulasan yang menunggu persetujuan saat ini.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {daftar.map((k) => (
        <div key={k.id} className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-2 text-sm">{k.isi}</p>
          <p className="mb-4 text-xs font-semibold text-brand-muted">
            - {k.nama} - {new Date(k.created_at).toLocaleString("id-ID")}
          </p>
          <div className="flex gap-3">
            <button
              disabled={memproses === k.id}
              onClick={() => setujui(k.id)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              <Check className="h-4 w-4" />
              Setujui
            </button>
            <button
              disabled={memproses === k.id}
              onClick={() => hapus(k.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}