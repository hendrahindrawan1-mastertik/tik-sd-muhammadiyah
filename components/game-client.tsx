"use client"

import { useEffect, useState } from "react"
import { Timer, Zap } from "lucide-react"
import type { Soal } from "@/lib/supabase/client"

const OPTION_LABELS: Array<"a" | "b" | "c" | "d"> = ["a", "b", "c", "d"]
const DETIK_PER_SOAL = 15

function acakSoal(soalList: Soal[], jumlah: number) {
  const disalin = [...soalList]
  for (let i = disalin.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[disalin[i], disalin[j]] = [disalin[j], disalin[i]]
  }
  return disalin.slice(0, jumlah)
}

function pesanHasil(skor: number, total: number) {
  const persen = total === 0 ? 0 : (skor / total) * 100
  if (persen === 100) return "Sempurna! Kamu jagoan TIK! 🏆"
  if (persen >= 60) return "Keren, sedikit lagi sempurna! 🎉"
  if (persen >= 40) return "Lumayan, ayo coba lagi! 💪"
  return "Yuk belajar dulu, terus coba lagi! 📚"
}

export function GameClient({ soalList }: { soalList: Soal[] }) {
  const [siap, setSiap] = useState(false)
  const [soalAcak, setSoalAcak] = useState<Soal[]>([])
  const [nomor, setNomor] = useState(0)
  const [skor, setSkor] = useState(0)
  const [waktu, setWaktu] = useState(DETIK_PER_SOAL)
  const [selesai, setSelesai] = useState(false)
  const [dipilih, setDipilih] = useState<"a" | "b" | "c" | "d" | null>(null)

  const mulai = () => {
    setSoalAcak(acakSoal(soalList, Math.min(5, soalList.length)))
    setNomor(0)
    setSkor(0)
    setWaktu(DETIK_PER_SOAL)
    setSelesai(false)
    setDipilih(null)
    setSiap(true)
  }

  useEffect(() => {
    if (!siap || selesai) return
    if (waktu <= 0) {
      lanjutKeSoalBerikutnya(false)
      return
    }
    const timer = setTimeout(() => setWaktu((w) => w - 1), 1000)
    return () => clearTimeout(timer)
  }, [waktu, siap, selesai])

  const lanjutKeSoalBerikutnya = (benar: boolean) => {
    if (benar) setSkor((s) => s + 1)
    if (nomor < soalAcak.length - 1) {
      setNomor((n) => n + 1)
      setWaktu(DETIK_PER_SOAL)
      setDipilih(null)
    } else {
      setSelesai(true)
    }
  }

  const pilihJawaban = (opsi: "a" | "b" | "c" | "d") => {
    if (dipilih) return
    setDipilih(opsi)
    const benar = opsi === soalAcak[nomor].jawaban_benar
    setTimeout(() => lanjutKeSoalBerikutnya(benar), 500)
  }

  if (soalList.length === 0) {
    return (
      <p className="text-brand-muted">
        Belum ada soal untuk kelas ini. Game akan tampil setelah guru menambahkan soal lewat Supabase.
      </p>
    )
  }

  if (!siap) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
        <Zap className="mx-auto mb-3 h-10 w-10 text-brand-purple" />
        <h2 className="mb-2 text-xl font-bold">Kuis Cepat</h2>
        <p className="mb-5 text-sm text-brand-muted">
          {Math.min(5, soalList.length)} soal, {DETIK_PER_SOAL} detik per soal. Jawab secepat mungkin!
        </p>
        <button
          onClick={mulai}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white"
        >
          Mulai Main
        </button>
      </div>
    )
  }

  if (selesai) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6 text-center">
        <p className="mb-2 text-sm text-brand-muted">Hasil Kamu</p>
        <p className="mb-2 text-4xl font-extrabold text-brand-purple">
          {skor} / {soalAcak.length}
        </p>
        <p className="mb-6 text-brand-muted">{pesanHasil(skor, soalAcak.length)}</p>
        <button
          onClick={mulai}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white"
        >
          Main Lagi
        </button>
      </div>
    )
  }

  const soal = soalAcak[nomor]

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-muted">
          Soal {nomor + 1} dari {soalAcak.length}
        </p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${
            waktu <= 5 ? "bg-red-100 text-red-500" : "bg-[#f4eefe] text-brand-purple"
          }`}
        >
          <Timer className="h-4 w-4" />
          {waktu}s
        </span>
      </div>

      <h3 className="mb-5 text-lg font-bold">{soal.pertanyaan}</h3>

      <div className="flex flex-col gap-3">
        {OPTION_LABELS.map((opsi) => {
          const adalahBenar = opsi === soal.jawaban_benar
          const tampilkanWarna = dipilih !== null
          return (
            <button
              key={opsi}
              disabled={dipilih !== null}
              onClick={() => pilihJawaban(opsi)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                tampilkanWarna && adalahBenar
                  ? "border-brand-green bg-[#eefbf1] text-brand-green"
                  : tampilkanWarna && dipilih === opsi
                    ? "border-red-300 bg-red-50 text-red-500"
                    : "border-border hover:bg-slate-50"
              }`}
            >
              {opsi.toUpperCase()}. {soal[`pilihan_${opsi}`]}
            </button>
          )
        })}
      </div>
    </div>
  )
}