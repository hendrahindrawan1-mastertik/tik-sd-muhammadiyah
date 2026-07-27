"use client"

import { useEffect, useState } from "react"
import { MessageSquareHeart, Send } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

type Komentar = {
  id: string
  nama: string
  isi: string
  created_at: string
}

export function UlasanClient() {
  const [nama, setNama] = useState("")
  const [isi, setIsi] = useState("")
  const [loading, setLoading] = useState(false)
  const [terkirim, setTerkirim] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [daftar, setDaftar] = useState<Komentar[]>([])
  const [memuat, setMemuat] = useState(true)

  const muatUlasan = async () => {
    setMemuat(true)
    const { data } = await supabase
      .from("komentar")
      .select("id, nama, isi, created_at")
      .order("created_at", { ascending: false })
    setDaftar(data ?? [])
    setMemuat(false)
  }

  useEffect(() => {
    muatUlasan()
  }, [])

  const handleKirim = async () => {
    setError(null)
    if (nama.trim().length === 0 || isi.trim().length === 0) {
      setError("Nama dan ulasan wajib diisi")
      return
    }
    setLoading(true)
    const { error: err } = await supabase.from("komentar").insert({
      nama: nama.trim(),
      isi: isi.trim(),
    })
    setLoading(false)

    if (err) {
      setError("Gagal mengirim: " + err.message)
      return
    }

    setTerkirim(true)
    setNama("")
    setIsi("")
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="mb-1 text-xl font-bold">Beri Ulasan</h3>
        <p className="mb-5 text-sm text-brand-muted">
          Ulasan kamu akan ditinjau dulu oleh guru sebelum tampil ke publik.
        </p>

        {terkirim ? (
          <div className="rounded-xl bg-[#eefbf1] p-4 text-sm text-brand-green">
            Terima kasih! Ulasan kamu sudah terkirim dan akan tampil setelah disetujui.
          </div>
        ) : (
          <>
            <label className="mb-1.5 block text-sm font-semibold">Nama</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama kamu"
              className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
            />

            <label className="mb-1.5 block text-sm font-semibold">Ulasan</label>
            <textarea
              value={isi}
              onChange={(e) => setIsi(e.target.value)}
              placeholder="Tulis pendapat kamu tentang website ini..."
              rows={4}
              className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
            />

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <button
              disabled={loading}
              onClick={handleKirim}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
              {loading ? "Mengirim..." : "Kirim Ulasan"}
            </button>
          </>
        )}
      </div>

      <div>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <MessageSquareHeart className="h-5 w-5 text-brand-blue" />
          Kata Pengunjung
        </h3>
        {memuat ? (
          <p className="text-brand-muted">Memuat ulasan...</p>
        ) : daftar.length === 0 ? (
          <p className="text-brand-muted">Belum ada ulasan yang tampil.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {daftar.map((k) => (
              <div key={k.id} className="rounded-2xl border border-border bg-slate-50 p-4">
                <p className="mb-2 text-sm">{k.isi}</p>
                <p className="text-xs font-semibold text-brand-muted">- {k.nama}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}