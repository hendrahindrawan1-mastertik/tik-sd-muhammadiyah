"use client"

import { useEffect, useMemo, useState } from "react"
import { Lightbulb, RotateCcw, Timer, Trophy } from "lucide-react"

type Kata = { kata: string; petunjuk: string }

const DETIK_PER_KATA = 25
const JUMLAH_SOAL = 8

const BANK_KATA: Record<4 | 5 | 6, Kata[]> = {
  4: [
    { kata: "KOMPUTER", petunjuk: "Alat elektronik untuk mengolah data" },
    { kata: "MOUSE", petunjuk: "Alat penunjuk yang digerakkan dengan tangan" },
    { kata: "KEYBOARD", petunjuk: "Alat untuk mengetik huruf dan angka" },
    { kata: "MONITOR", petunjuk: "Layar untuk melihat hasil kerja komputer" },
    { kata: "PRINTER", petunjuk: "Alat untuk mencetak dokumen di kertas" },
    { kata: "SPEAKER", petunjuk: "Alat untuk mengeluarkan suara" },
    { kata: "INTERNET", petunjuk: "Jaringan yang menghubungkan komputer sedunia" },
    { kata: "LAYAR", petunjuk: "Bagian tempat gambar dan tulisan tampil" },
    { kata: "KABEL", petunjuk: "Penghubung antar perangkat elektronik" },
    { kata: "BATERAI", petunjuk: "Sumber daya untuk perangkat tanpa listrik langsung" },
  ],
  5: [
    { kata: "BROWSER", petunjuk: "Aplikasi untuk menjelajah internet" },
    { kata: "JARINGAN", petunjuk: "Kumpulan perangkat yang saling terhubung" },
    { kata: "DOKUMEN", petunjuk: "File berisi tulisan atau data" },
    { kata: "PASSWORD", petunjuk: "Kata sandi untuk menjaga keamanan akun" },
    { kata: "WEBSITE", petunjuk: "Halaman yang bisa dibuka lewat internet" },
    { kata: "UNDUH", petunjuk: "Mengambil file dari internet ke perangkat" },
    { kata: "FOLDER", petunjuk: "Tempat menyimpan dan mengelompokkan file" },
    { kata: "APLIKASI", petunjuk: "Program yang dipakai untuk tugas tertentu" },
    { kata: "IKON", petunjuk: "Gambar kecil yang mewakili aplikasi atau file" },
    { kata: "GAMBAR", petunjuk: "Hasil visual yang bisa disimpan di komputer" },
  ],
  6: [
    { kata: "PROGRAM", petunjuk: "Kumpulan instruksi yang dijalankan komputer" },
    { kata: "ALGORITMA", petunjuk: "Urutan langkah untuk menyelesaikan masalah" },
    { kata: "DATABASE", petunjuk: "Tempat menyimpan data dalam jumlah besar" },
    { kata: "PERANGKAT", petunjuk: "Sebutan umum untuk alat elektronik" },
    { kata: "SERVER", petunjuk: "Komputer yang melayani banyak pengguna" },
    { kata: "ROUTER", petunjuk: "Alat pembagi sinyal internet Wi-Fi" },
    { kata: "ENKRIPSI", petunjuk: "Cara mengamankan data agar tidak terbaca sembarangan" },
    { kata: "ROBOTIKA", petunjuk: "Ilmu tentang membuat dan mengendalikan robot" },
    { kata: "BINER", petunjuk: "Bahasa komputer berupa angka 0 dan 1" },
    { kata: "SENSOR", petunjuk: "Alat yang mendeteksi perubahan di sekitarnya" },
  ],
}

function acakHuruf(kata: string) {
  let hasil = kata
  const huruf = kata.split("")
  let percobaan = 0
  do {
    for (let i = huruf.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[huruf[i], huruf[j]] = [huruf[j], huruf[i]]
    }
    hasil = huruf.join("")
    percobaan++
  } while (hasil === kata && percobaan < 10)
  return hasil
}

function acakSoal(bank: Kata[], jumlah: number) {
  const disalin = [...bank]
  for (let i = disalin.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[disalin[i], disalin[j]] = [disalin[j], disalin[i]]
  }
  return disalin.slice(0, Math.min(jumlah, disalin.length))
}

function pesanHasil(skor: number, total: number) {
  const persen = total === 0 ? 0 : (skor / total) * 100
  if (persen === 100) return "Sempurna! Kosakata TIK-mu jago banget! 🏆"
  if (persen >= 60) return "Bagus, terus berlatih ya! 🎉"
  if (persen >= 40) return "Lumayan, coba lagi biar makin jago! 💪"
  return "Yuk baca-baca materi dulu, lalu coba lagi! 📚"
}

export function SusunKataClient({ kelas }: { kelas: 4 | 5 | 6 }) {
  const bank = BANK_KATA[kelas]

  const [siap, setSiap] = useState(false)
  const [soal, setSoal] = useState<Kata[]>([])
  const [acakan, setAcakan] = useState<string[]>([])
  const [nomor, setNomor] = useState(0)
  const [skor, setSkor] = useState(0)
  const [waktu, setWaktu] = useState(DETIK_PER_KATA)
  const [selesai, setSelesai] = useState(false)
  const [jawaban, setJawaban] = useState("")
  const [status, setStatus] = useState<"main" | "benar" | "salah">("main")
  const [tampilPetunjuk, setTampilPetunjuk] = useState(false)

  const soalSekarang = soal[nomor]

  const mulai = () => {
    const dipilih = acakSoal(bank, JUMLAH_SOAL)
    setSoal(dipilih)
    setAcakan(dipilih.map((s) => acakHuruf(s.kata)))
    setNomor(0)
    setSkor(0)
    setWaktu(DETIK_PER_KATA)
    setSelesai(false)
    setJawaban("")
    setStatus("main")
    setTampilPetunjuk(false)
    setSiap(true)
  }

  useEffect(() => {
    if (!siap || selesai || status !== "main") return
    if (waktu <= 0) {
      lanjut(false)
      return
    }
    const timer = setTimeout(() => setWaktu((w) => w - 1), 1000)
    return () => clearTimeout(timer)
  }, [waktu, siap, selesai, status])

  const lanjut = (benar: boolean) => {
    setStatus(benar ? "benar" : "salah")
    if (benar) setSkor((s) => s + 1)
    setTimeout(() => {
      if (nomor < soal.length - 1) {
        setNomor((n) => n + 1)
        setWaktu(DETIK_PER_KATA)
        setJawaban("")
        setStatus("main")
        setTampilPetunjuk(false)
      } else {
        setSelesai(true)
      }
    }, 900)
  }

  const cekJawaban = () => {
    if (status !== "main") return
    const benar = jawaban.trim().toUpperCase() === soalSekarang.kata
    lanjut(benar)
  }

  const persentaseWaktu = useMemo(() => Math.max(0, (waktu / DETIK_PER_KATA) * 100), [waktu])

  if (!siap) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <h3 className="mb-2 text-2xl font-extrabold text-brand-purple">Susun Kata TIK</h3>
        <p className="mb-6 text-brand-muted">
          Huruf-huruf istilah TIK akan diacak. Susun kembali jadi kata yang benar sebelum waktu habis!
        </p>
        <button
          onClick={mulai}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Mulai Bermain
        </button>
      </div>
    )
  }

  if (selesai) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <Trophy className="mx-auto mb-3 h-12 w-12 text-[#f2a900]" />
        <h3 className="mb-1 text-2xl font-extrabold text-brand-purple">
          Skor Kamu: {skor} / {soal.length}
        </h3>
        <p className="mb-6 text-brand-muted">{pesanHasil(skor, soal.length)}</p>
        <button
          onClick={mulai}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-purple px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          Main Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-brand-muted">
        <span>Soal {nomor + 1} / {soal.length}</span>
        <span className="inline-flex items-center gap-1.5">
          <Timer className="h-4 w-4" />
          {waktu}s
        </span>
      </div>

      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-purple transition-all"
          style={{ width: `${persentaseWaktu}%` }}
        />
      </div>

      <div className="mb-6 text-center">
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {acakan[nomor]?.split("").map((huruf, i) => (
            <div
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f4eefe] text-xl font-extrabold text-brand-purple"
            >
              {huruf}
            </div>
          ))}
        </div>

        {tampilPetunjuk ? (
          <p className="mb-2 text-sm font-medium text-brand-blue">💡 {soalSekarang.petunjuk}</p>
        ) : (
          <button
            onClick={() => setTampilPetunjuk(true)}
            className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted hover:text-brand-blue"
          >
            <Lightbulb className="h-4 w-4" />
            Lihat petunjuk
          </button>
        )}
      </div>

      <div className="mx-auto flex max-w-sm items-center gap-2">
        <input
          type="text"
          value={jawaban}
          onChange={(e) => setJawaban(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && cekJawaban()}
          disabled={status !== "main"}
          placeholder="Tulis jawabanmu..."
          className={`w-full rounded-xl border px-4 py-3 text-center text-lg font-semibold uppercase tracking-wide outline-none ${
            status === "benar"
              ? "border-brand-green bg-[#eefbf1] text-brand-green"
              : status === "salah"
                ? "border-red-400 bg-red-50 text-red-500"
                : "border-border focus:border-brand-purple"
          }`}
        />
        <button
          onClick={cekJawaban}
          disabled={status !== "main" || jawaban.trim() === ""}
          className="rounded-xl bg-brand-purple px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          Cek
        </button>
      </div>

      {status === "benar" && <p className="mt-3 text-center font-semibold text-brand-green">Benar! 🎉</p>}
      {status === "salah" && (
        <p className="mt-3 text-center font-semibold text-red-500">
          Kurang tepat, jawabannya: {soalSekarang.kata}
        </p>
      )}
    </div>
  )
}
