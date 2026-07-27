"use client"

import { useState } from "react"
import { CheckCircle2, Camera, LogIn } from "lucide-react"
import { supabase, type Siswa } from "@/lib/supabase/client"

function tanggalHariIni() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function AbsenClient() {
  const [step, setStep] = useState<"login" | "foto" | "absen" | "selesai">("login")
  const [nisn, setNisn] = useState("")
  const [password, setPassword] = useState("")
  const [siswa, setSiswa] = useState<Siswa | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jamAbsen, setJamAbsen] = useState<string | null>(null)

  const handleLogin = async () => {
    setError(null)
    if (nisn.trim().length === 0 || password.trim().length === 0) {
      setError("NISN dan Password wajib diisi")
      return
    }
    if (nisn.trim() !== password.trim()) {
      setError("Password harus sama dengan NISN kamu")
      return
    }
    setLoading(true)
    const { data, error: err } = await supabase
      .from("siswa")
      .select("*")
      .eq("nisn", nisn.trim())
      .maybeSingle()
    setLoading(false)

    if (err || !data) {
      setError("NISN tidak ditemukan. Hubungi guru kalau ini salah.")
      return
    }

    setSiswa(data)
    setStep(data.foto_url ? "absen" : "foto")
  }

  const handleUploadFoto = async (file: File) => {
    if (!siswa) return
    setError(null)
    setLoading(true)

    const namaFile = `${siswa.id}-${Date.now()}.jpg`
    const { error: uploadError } = await supabase.storage
      .from("foto-profil")
      .upload(namaFile, file, { upsert: true })

    if (uploadError) {
      setLoading(false)
      setError("Gagal upload foto: " + uploadError.message)
      return
    }

    const { data: publicUrlData } = supabase.storage.from("foto-profil").getPublicUrl(namaFile)
    const fotoUrl = publicUrlData.publicUrl

    const { error: updateError } = await supabase
      .from("siswa")
      .update({ foto_url: fotoUrl })
      .eq("id", siswa.id)

    setLoading(false)

    if (updateError) {
      setError("Gagal simpan foto: " + updateError.message)
      return
    }

    setSiswa({ ...siswa, foto_url: fotoUrl })
    setStep("absen")
  }

  const handleAbsen = async () => {
    if (!siswa) return
    setError(null)
    setLoading(true)

    const hariIni = tanggalHariIni()

    const { data: sudahAda } = await supabase
      .from("absensi")
      .select("jam")
      .eq("siswa_id", siswa.id)
      .eq("tanggal", hariIni)
      .maybeSingle()

    if (sudahAda) {
      setLoading(false)
      setJamAbsen(new Date(sudahAda.jam).toLocaleTimeString("id-ID"))
      setStep("selesai")
      return
    }

    const { data: inserted, error: insertError } = await supabase
      .from("absensi")
      .insert({ siswa_id: siswa.id, tanggal: hariIni })
      .select("jam")
      .single()

    setLoading(false)

    if (insertError) {
      setError("Gagal menyimpan absen: " + insertError.message)
      return
    }

    setJamAbsen(new Date(inserted.jam).toLocaleTimeString("id-ID"))
    setStep("selesai")
  }

  if (step === "login") {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-1 text-xl font-bold">Absen Siswa</h2>
        <p className="mb-5 text-sm text-brand-muted">Masuk dengan NISN kamu</p>

        <label className="mb-1.5 block text-sm font-semibold">NISN</label>
        <input
          type="text"
          inputMode="numeric"
          value={nisn}
          onChange={(e) => setNisn(e.target.value)}
          placeholder="Contoh: 0123456789"
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        <label className="mb-1.5 block text-sm font-semibold">Password (isi NISN lagi)</label>
        <input
          type="password"
          inputMode="numeric"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Isi NISN kamu lagi"
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

  if (step === "foto" && siswa) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
        <Camera className="mx-auto mb-3 h-10 w-10 text-brand-blue" />
        <h2 className="mb-1 text-xl font-bold">Halo, {siswa.nama}!</h2>
        <p className="mb-5 text-sm text-brand-muted">
          Ini pertama kalinya kamu absen. Upload foto dulu untuk profil kamu.
        </p>

        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleUploadFoto(file)
          }}
          className="mb-4 w-full text-sm"
        />

        {loading && <p className="text-sm text-brand-muted">Mengunggah foto...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }

  if (step === "absen" && siswa) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
        {siswa.foto_url && (
          <img
            src={siswa.foto_url}
            alt={siswa.nama}
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
          />
        )}
        <h2 className="mb-1 text-xl font-bold">{siswa.nama}</h2>
        <p className="mb-5 text-sm text-brand-muted">Kelas {siswa.kelas}</p>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          onClick={handleAbsen}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          <CheckCircle2 className="h-4 w-4" />
          {loading ? "Menyimpan..." : "Absen Sekarang"}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
      <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-brand-green" />
      <h2 className="mb-1 text-xl font-bold">Absen Berhasil!</h2>
      <p className="text-brand-muted">
        {siswa?.nama} tercatat hadir pukul {jamAbsen}
      </p>
    </div>
  )
}