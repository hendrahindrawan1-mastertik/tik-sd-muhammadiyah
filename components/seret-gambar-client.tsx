"use client"

import { useRef, useState } from "react"
import { RotateCcw, Trophy } from "lucide-react"

type Item = { id: string; label: string; emoji: string; kategori: string }
type Kategori = { nama: string; warna: string }

const DATA: Record<
  4 | 5 | 6,
  { kategori: Kategori[]; item: Item[] }
> = {
  4: {
    kategori: [
      { nama: "Hardware", warna: "#2367c9" },
      { nama: "Software", warna: "#36a85a" },
    ],
    item: [
      { id: "mouse", label: "Mouse", emoji: "🖱️", kategori: "Hardware" },
      { id: "keyboard", label: "Keyboard", emoji: "⌨️", kategori: "Hardware" },
      { id: "monitor", label: "Monitor", emoji: "🖥️", kategori: "Hardware" },
      { id: "printer", label: "Printer", emoji: "🖨️", kategori: "Hardware" },
      { id: "word", label: "Microsoft Word", emoji: "📝", kategori: "Software" },
      { id: "game", label: "Aplikasi Game", emoji: "🎮", kategori: "Software" },
      { id: "browser", label: "Browser", emoji: "🌐", kategori: "Software" },
      { id: "kalkulator", label: "Kalkulator", emoji: "🧮", kategori: "Software" },
    ],
  },
  5: {
    kategori: [
      { nama: "Input", warna: "#2367c9" },
      { nama: "Proses", warna: "#f2a900" },
      { nama: "Output", warna: "#36a85a" },
    ],
    item: [
      { id: "keyboard", label: "Keyboard", emoji: "⌨️", kategori: "Input" },
      { id: "mouse", label: "Mouse", emoji: "🖱️", kategori: "Input" },
      { id: "mikrofon", label: "Mikrofon", emoji: "🎤", kategori: "Input" },
      { id: "cpu", label: "CPU", emoji: "🧠", kategori: "Proses" },
      { id: "ram", label: "RAM", emoji: "💾", kategori: "Proses" },
      { id: "motherboard", label: "Motherboard", emoji: "🔌", kategori: "Proses" },
      { id: "monitor", label: "Monitor", emoji: "🖥️", kategori: "Output" },
      { id: "printer", label: "Printer", emoji: "🖨️", kategori: "Output" },
      { id: "speaker", label: "Speaker", emoji: "🔊", kategori: "Output" },
    ],
  },
  6: {
    kategori: [
      { nama: "Hardware", warna: "#2367c9" },
      { nama: "Software", warna: "#36a85a" },
      { nama: "Jaringan", warna: "#7050b8" },
    ],
    item: [
      { id: "monitor", label: "Monitor", emoji: "🖥️", kategori: "Hardware" },
      { id: "keyboard", label: "Keyboard", emoji: "⌨️", kategori: "Hardware" },
      { id: "printer", label: "Printer", emoji: "🖨️", kategori: "Hardware" },
      { id: "os", label: "Sistem Operasi", emoji: "💻", kategori: "Software" },
      { id: "antivirus", label: "Antivirus", emoji: "🛡️", kategori: "Software" },
      { id: "editor", label: "Aplikasi Edit Foto", emoji: "🖼️", kategori: "Software" },
      { id: "router", label: "Router", emoji: "📶", kategori: "Jaringan" },
      { id: "kabel", label: "Kabel LAN", emoji: "🔗", kategori: "Jaringan" },
      { id: "server", label: "Server", emoji: "🗄️", kategori: "Jaringan" },
    ],
  },
}

function acak<T>(arr: T[]): T[] {
  const hasil = [...arr]
  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[hasil[i], hasil[j]] = [hasil[j], hasil[i]]
  }
  return hasil
}

export function SeretGambarClient({ kelas }: { kelas: 4 | 5 | 6 }) {
  const { kategori, item: bankItem } = DATA[kelas]

  const [siap, setSiap] = useState(false)
  const [pool, setPool] = useState<Item[]>([])
  const [selesai, setSelesai] = useState<Record<string, "benar" | "salah">>({})
  const [salahCount, setSalahCount] = useState(0)
  const [sedangDiseret, setSedangDiseret] = useState<Item | null>(null)
  const [posisi, setPosisi] = useState({ x: 0, y: 0 })
  const [binAktif, setBinAktif] = useState<string | null>(null)

  const binRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const offset = useRef({ x: 0, y: 0 })

  const mulai = () => {
    setPool(acak(bankItem))
    setSelesai({})
    setSalahCount(0)
    setSiap(true)
  }

  const totalSelesai = Object.keys(selesai).length
  const totalItem = bankItem.length
  const semuaSelesai = siap && totalSelesai === totalItem

  const cariBinDiTitik = (x: number, y: number): string | null => {
    for (const nama of Object.keys(binRefs.current)) {
      const el = binRefs.current[nama]
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        return nama
      }
    }
    return null
  }

  const mulaiSeret = (e: React.PointerEvent, i: Item) => {
    if (selesai[i.id]) return
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    setSedangDiseret(i)
    setPosisi({ x: rect.left, y: rect.top })
  }

  const bergerak = (e: React.PointerEvent) => {
    if (!sedangDiseret) return
    const x = e.clientX - offset.current.x
    const y = e.clientY - offset.current.y
    setPosisi({ x, y })
    const bin = cariBinDiTitik(e.clientX, e.clientY)
    setBinAktif(bin)
  }

  const lepasSeret = (e: React.PointerEvent) => {
    if (!sedangDiseret) return
    const bin = cariBinDiTitik(e.clientX, e.clientY)
    if (bin) {
      const benar = bin === sedangDiseret.kategori
      setSelesai((s) => ({ ...s, [sedangDiseret.id]: benar ? "benar" : "salah" }))
      if (!benar) setSalahCount((n) => n + 1)
      if (benar) {
        setTimeout(() => {
          setPool((p) => p.filter((it) => it.id !== sedangDiseret.id))
        }, 350)
      } else {
        // kembali ke pool, hapus status salah setelah sebentar supaya bisa dicoba lagi
        setTimeout(() => {
          setSelesai((s) => {
            const salinan = { ...s }
            delete salinan[sedangDiseret.id]
            return salinan
          })
        }, 500)
      }
    }
    setSedangDiseret(null)
    setBinAktif(null)
  }

  if (!siap) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <h3 className="mb-2 text-2xl font-extrabold text-brand-blue">Seret &amp; Taruh</h3>
        <p className="mb-6 text-brand-muted">
          Seret setiap item ke kotak kategori yang benar. Yuk coba dulu, salah itu wajar, tinggal coba lagi!
        </p>
        <button
          onClick={mulai}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Mulai Bermain
        </button>
      </div>
    )
  }

  if (semuaSelesai) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <Trophy className="mx-auto mb-3 h-12 w-12 text-[#f2a900]" />
        <h3 className="mb-1 text-2xl font-extrabold text-brand-blue">Selesai! 🎉</h3>
        <p className="mb-6 text-brand-muted">
          Semua {totalItem} item berhasil dikategorikan
          {salahCount > 0 ? ` (dengan ${salahCount} kali percobaan salah).` : " tanpa salah sekali pun!"}
        </p>
        <button
          onClick={mulai}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          <RotateCcw className="h-4 w-4" />
          Main Lagi
        </button>
      </div>
    )
  }

  return (
    <div
      className="select-none rounded-3xl border border-border bg-card p-6 md:p-8"
      style={{ touchAction: "none" }}
      onPointerMove={bergerak}
      onPointerUp={lepasSeret}
    >
      <p className="mb-4 text-center text-sm font-semibold text-brand-muted">
        Sudah benar: {totalItem - pool.length} / {totalItem}
      </p>

      {/* Kotak kategori */}
      <div
        className="mb-8 grid gap-4"
        style={{ gridTemplateColumns: `repeat(${kategori.length}, minmax(0, 1fr))` }}
      >
        {kategori.map((k) => (
          <div
            key={k.nama}
            ref={(el) => {
              binRefs.current[k.nama] = el
            }}
            className="flex h-28 flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-colors"
            style={{
              borderColor: k.warna,
              background: binAktif === k.nama ? `${k.warna}22` : `${k.warna}0d`,
            }}
          >
            <span className="text-sm font-extrabold" style={{ color: k.warna }}>
              {k.nama}
            </span>
          </div>
        ))}
      </div>

      {/* Pool item yang belum ditaruh */}
      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((it) => {
          const status = selesai[it.id]
          const sedangDitarik = sedangDiseret?.id === it.id
          if (sedangDitarik) return null
          return (
            <div
              key={it.id}
              onPointerDown={(e) => mulaiSeret(e, it)}
              className={`flex cursor-grab items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm active:cursor-grabbing ${
                status === "salah"
                  ? "border-red-400 bg-red-50 text-red-500"
                  : "border-border bg-white text-brand-ink"
              }`}
            >
              <span className="text-xl">{it.emoji}</span>
              {it.label}
            </div>
          )
        })}
      </div>

      {/* Item yang sedang diseret, mengikuti posisi kursor/jari */}
      {sedangDiseret && (
        <div
          className="pointer-events-none fixed z-50 flex items-center gap-2 rounded-xl border border-brand-blue bg-white px-4 py-3 text-sm font-semibold shadow-lg"
          style={{ left: posisi.x, top: posisi.y }}
        >
          <span className="text-xl">{sedangDiseret.emoji}</span>
          {sedangDiseret.label}
        </div>
      )}
    </div>
  )
}
