"use client"

import { useState } from "react"
import { supabase, type Soal } from "@/lib/supabase/client"

const OPTION_LABELS: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"]

export function QuizClient({ kelas, soalList }: { kelas: 4 | 5 | 6; soalList: Soal[] }) {
  const [step, setStep] = useState<"nama" | "kuis" | "hasil">("nama")
  const [nama, setNama] = useState("")
  const [jawaban, setJawaban] = useState<Record<string, "a" | "b" | "c" | "d">>({})
  const [nomor, setNomor] = useState(0)
  const [skor, setSkor] = useState(0)
  const [menyimpan, setMenyimpan] = useState(false)
  const [errorSimpan, setErrorSimpan] = useState<string | null>(null)

  if (soalList.length === 0) {
    return (
      <p className="text-brand-muted">
        Belum ada soal untuk kelas ini. Soal akan tampil di sini setelah ditambahkan oleh guru lewat Supabase.
      </p>
    )
  }

  if (step === "nama") {
    return (
      <div className="max-w-md rounded-3xl border border-border bg-card p-6">
        <label className="mb-2 block text-sm font-semibold">Nama Kamu</label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Tulis nama lengkap kamu"
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />
        <button
          disabled={nama.trim().length === 0}
          onClick={() => setStep("kuis")}
          className="w-full rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Mulai Kuis
        </button>
      </div>
    )
  }

  if (step === "kuis") {
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
      setMenyimpan(true)
      const { error } = await supabase.from("hasil_kuis").insert({
        nama_siswa: nama.trim(),
        kelas,
        skor: benar,
        total_soal: soalList.length,
      })
      setMenyimpan(false)
      if (error) setErrorSimpan(error.message)
      setStep("hasil")
    }

    return (
      <div className="max-w-xl rounded-3xl border border-border bg-card p-6">
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
          disabled={!dipilih || menyimpan}
          onClick={lanjut}
          className="w-full rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          {nomor < soalList.length - 1 ? "Soal Berikutnya" : menyimpan ? "Menyimpan..." : "Selesai"}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md rounded-3xl border border-border bg-card p-6 text-center">
      <p className="mb-2 text-sm text-brand-muted">Hasil Kuis</p>
      <p className="mb-1 text-4xl font-extrabold text-brand-blue">
        {skor} / {soalList.length}
      </p>
      <p className="text-brand-muted">Terima kasih, {nama}!</p>
      {errorSimpan && (
        <p className="mt-3 text-xs text-red-500">
          Catatan: skor belum tersimpan ke server ({errorSimpan})
        </p>
      )}
    </div>
  )
}