"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

type Soal = {
  pertanyaan: string
  opsi: { teks: string; benar: boolean }[]
}

const soalList: Soal[] = [
  {
    pertanyaan: "Kamu menemukan jawaban tugas komputer di internet. Apa yang kamu lakukan?",
    opsi: [
      { teks: "Langsung menyalin semua tulisan tanpa dibaca", benar: false },
      { teks: "Membaca, memahami, lalu menuliskan kembali dengan bahasamu", benar: true },
    ],
  },
  {
    pertanyaan: "Temanmu izin memakai gambar hasil karyamu untuk tugasnya. Apa yang sebaiknya kamu lakukan?",
    opsi: [
      { teks: "Boleh, asal dia tulis nama pembuatnya", benar: true },
      { teks: "Biarkan saja dia bilang itu karyanya sendiri", benar: false },
    ],
  },
  {
    pertanyaan: "Mouse komputer sekolah sedikit rusak saat kamu pakai. Apa yang sebaiknya kamu lakukan?",
    opsi: [
      { teks: "Diam saja dan pura-pura tidak tahu", benar: false },
      { teks: "Melaporkan ke guru dengan jujur", benar: true },
    ],
  },
  {
    pertanyaan: "Saat jam pelajaran TIK, kamu selesai lebih cepat. Apa yang sebaiknya kamu lakukan?",
    opsi: [
      { teks: "Membuka game atau video yang tidak berhubungan dengan materi", benar: false },
      { teks: "Bertanya ke guru atau membantu belajar hal baru yang berhubungan", benar: true },
    ],
  },
  {
    pertanyaan: "Temanmu menawarkan file tugas komputernya untuk kamu kirim sebagai tugasmu. Apa yang kamu lakukan?",
    opsi: [
      { teks: "Menolak dan mengerjakan sendiri", benar: true },
      { teks: "Menerimanya karena lebih cepat selesai", benar: false },
    ],
  },
]

export function SikapDigitalQuizClient() {
  const [nomor, setNomor] = useState(0)
  const [skor, setSkor] = useState(0)
  const [nyawa, setNyawa] = useState(3)
  const [dipilih, setDipilih] = useState<number | null>(null)
  const [selesai, setSelesai] = useState(false)

  const soal = soalList[nomor]

  const jawab = () => {
    if (dipilih === null) return
    const benar = soal.opsi[dipilih].benar
    const skorBaru = benar ? skor + 20 : skor
    const nyawaBaru = benar ? nyawa : nyawa - 1

    setSkor(skorBaru)
    setNyawa(nyawaBaru)

    if (nomor === soalList.length - 1 || nyawaBaru === 0) {
      setSkor(skorBaru)
      setSelesai(true)
      return
    }

    setNomor(nomor + 1)
    setDipilih(null)
  }

  const ulangi = () => {
    setNomor(0)
    setSkor(0)
    setNyawa(3)
    setDipilih(null)
    setSelesai(false)
  }

  if (selesai) {
    return (
      <div className="max-w-md rounded-3xl border border-border bg-card p-6 text-center">
        <p className="mb-2 text-sm text-brand-muted">Skor Kejujuran Digitalmu</p>
        <p className="mb-4 text-4xl font-extrabold text-brand-red">{skor}</p>
        <p className="mb-5 text-sm text-brand-muted">
          {nyawa === 0
            ? "Yuk coba lagi, ingat selalu jujur dan bertanggung jawab ya!"
            : "Kerja bagus! Kamu sudah jadi pahlawan digital yang jujur."}
        </p>
        <button
          onClick={ulangi}
          className="w-full rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white"
        >
          Main Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl rounded-3xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-brand-muted">
        <span>Skor: {skor}</span>
        <span className="flex items-center gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart
              key={i}
              className={`h-4 w-4 ${i < nyawa ? "fill-brand-red text-brand-red" : "text-border"}`}
            />
          ))}
        </span>
      </div>
      <p className="mb-4 text-xs font-semibold text-brand-muted">
        Soal {nomor + 1} dari {soalList.length}
      </p>
      <h3 className="mb-5 text-lg font-bold">{soal.pertanyaan}</h3>
      <div className="mb-6 flex flex-col gap-3">
        {soal.opsi.map((opsi, i) => (
          <button
            key={i}
            onClick={() => setDipilih(i)}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
              dipilih === i
                ? "border-brand-red bg-[#fdeeee] text-brand-red"
                : "border-border hover:bg-slate-50"
            }`}
          >
            {String.fromCharCode(65 + i)}. {opsi.teks}
          </button>
        ))}
      </div>
      <button
        disabled={dipilih === null}
        onClick={jawab}
        className="w-full rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
      >
        Jawab Sekarang
      </button>
    </div>
  )
}
