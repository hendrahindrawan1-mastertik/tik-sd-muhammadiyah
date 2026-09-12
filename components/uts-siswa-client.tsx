"use client"

import { useState } from "react"
import { LogIn, CheckCircle2 } from "lucide-react"
import { supabase, type Siswa, type SoalUTS } from "@/lib/supabase/client"

const OPTION_LABELS: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"]

export function UTSSiswaClient({ kelas, soalList }: { kelas: 4 | 5 | 6; soalList: SoalUTS[] }) {
  const [step, setStep] = useState<"login" | "sudah_selesai" | "kuis" | "hasil">("login")
  const [nisn, setNisn] = useState("")
  const [password, setPassword] = useState("")
  const [siswa, setSiswa] = useState<Siswa | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nomor, setNomor] = useState(0)
  const [jawaban, setJawaban] = useState<Record<string, "a" | "b" | "c" | "d">>({})
  const [skor, setSkor] = useState(0)
  const [skorLama, setSkorLama] = useState<number | null>(null)

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

    const { data: dataSiswa, error: errSiswa } = await supabase
      .from("siswa")
      .select("*")
      .eq("nisn", nisn.trim())
      .maybeSingle()

    if (errSiswa || !dataSiswa) {
      setLoading(false)
      setError("NISN tidak ditemukan. Hubungi guru kalau ini salah.")
      return
    }

    // Cek apakah siswa ini sudah pernah mengerjakan UTS kelas ini
    const { data: hasilLama } = await supabase
      .from("hasil_uts")
      .select("skor, total_soal")
      .eq("siswa_id", dataSiswa.id)
      .maybeSingle()

    setLoading(false)
    setSiswa(dataSiswa)

    if (hasilLama) {
      setSkorLama(hasilLama.skor)
      setStep("sudah_selesai")
      return
    }

    if (soalList.length === 0) {
      setError("Soal UTS untuk kelas ini belum tersedia. Hubungi guru.")
      return
    }

    setStep("kuis")
  }

  if (step === "login") {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-1 text-xl font-bold">Login UTS</h2>
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
          {loading ? "Memeriksa..." : "Masuk & Mulai UTS"}
        </button>
      </div>
    )
  }

  if (step === "sudah_selesai") {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-brand-green" />
        <h2 className="mb-1 text-xl font-bold">Kamu Sudah Mengerjakan UTS Ini</h2>
        <p className="text-brand-muted">
          Nilai kamu: <span className="font-bold text-brand-blue">{skorLama}</span> dari{" "}
          {soalList.length} soal. Kalau merasa ini salah, hubungi guru.
        </p>
      </div>
    )
  }

  if (step === "kuis" && siswa) {
    const soal = soalList[nomor]
    const dipilih = jawaban[soal.id]

    const pilihJawaban = (opsi: "a" | "b" | "c" | "d") => {
      setJawaban((prev) => ({ ...prev, [soal.id]: opsi }))
    }

    const lanjut = async () => {
      if (nomor < soalList.length - 1) {
        setNomor(nomor + 1)
        return
      }

      let benar = 0
      for (const s of soalList) {
        if (jawaban[s.id] === s.jawaban_benar) benar++
      }
      setSkor(benar)
      setLoading(true)
      const { error: err } = await supabase.from("hasil_uts").insert({
        siswa_id: siswa.id,
        nama_siswa: siswa.nama,
        nisn: siswa.nisn,
        kelas,
        skor: benar,
        total_soal: soalList.length,
      })
      setLoading(false)
      if (err) setError("Nilai gagal tersimpan: " + err.message)
      setStep("hasil")
    }

    return (
      <div className="max-w-xl rounded-3xl border border-border bg-card p-6">
        <p className="mb-1 text-sm font-semibold text-brand-muted">{siswa.nama}</p>
        <p className="mb-4 text-sm font-semibold text-brand-muted">
          Soal {nomor + 1} dari {soalList.length}
        </p>
        <h3 className="mb-5 text-lg font-bold">{soal.pertanyaan}</h3>
        <div className="mb-6 flex flex-col gap-3">
          {OPTION_LABELS.map((opsi) => (
            <button
              key={opsi}
              onClick={() => pilihJawaban(opsi)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                dipilih === opsi
                  ? "border-brand-blue bg-[#eef4ff] text-brand-blue"
                  : "border-border hover:bg-slate-50"
              }`}
            >
              {opsi.toUpperCase()}. {soal[`pilihan_${opsi}`]}
            </button>
          ))}
        </div>
        <button
          disabled={!dipilih || loading}
          onClick={lanjut}
          className="w-full rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {nomor < soalList.length - 1 ? "Soal Berikutnya" : loading ? "Menyimpan..." : "Selesai & Kumpulkan"}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 text-center">
      <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-brand-green" />
      <p className="mb-2 text-sm text-brand-muted">UTS Selesai</p>
      <p className="mb-1 text-4xl font-extrabold text-brand-blue">
        {skor} / {soalList.length}
      </p>
      <p className="text-brand-muted">Terima kasih, {siswa?.nama}!</p>
      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </div>
  )
}
