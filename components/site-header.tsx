"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Atom } from "lucide-react"

// href diawali "/" supaya menu berfungsi dari halaman mana pun.
// "match" = awal alamat halaman yang membuat menu tampil aktif (bergaris bawah).
const navItems = [
  { label: "Beranda", href: "/", match: "/", exact: true },
  { label: "Materi", href: "/#materi" },
  { label: "Tugas", href: "/tugas", match: "/tugas" },
  { label: "Video", href: "/video", match: "/video" },
  { label: "Soal", href: "/soal", match: "/soal" },
  { label: "UTS", href: "/uts", match: "/uts" },
  { label: "Game", href: "/game", match: "/game" },
  { label: "Info", href: "/#info" },
  { label: "Admin", href: "/guru/rekap-absensi", match: "/guru" },
]

export function SiteHeader() {
  const [menuTerbuka, setMenuTerbuka] = useState(false)
  const pathname = usePathname()

  const aktif = (item: (typeof navItems)[number]) => {
    if (!item.match) return false
    if (item.exact) return pathname === item.match
    return pathname === item.match || pathname.startsWith(item.match + "/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3.5">
          <img
            src="/images/logo-sekolah.jpg"
            alt="Logo SD Muhammadiyah 01 Kukusan"
            width={52}
            height={52}
            className="h-[52px] w-[52px] shrink-0 object-contain"
          />
          <div>
            <h1 className="text-lg font-extrabold tracking-tight sm:text-xl">
              <span className="text-brand-blue">TIK SD</span>{" "}
              <span className="font-medium text-brand-ink">MUHAMMADIYAH 01 KUKUSAN</span>
            </h1>
            <p className="text-sm text-brand-muted">Belajar TIK Jadi Mudah &amp; Seru!</p>
          </div>
        </div>

        <nav aria-label="Navigasi utama" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={
                    aktif(item)
                      ? "border-b-[3px] border-brand-blue pb-1.5 text-base font-bold text-brand-blue"
                      : "pb-1.5 text-base font-medium text-slate-700 transition-colors hover:text-brand-blue"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden xl:block">
          <Link
            href="/stem"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-transform hover:-translate-y-0.5 hover:bg-brand-blue-dark"
          >
            <Atom className="h-[18px] w-[18px]" />
            STEM
          </Link>
        </div>

        <button
          aria-label="Buka menu"
          onClick={() => setMenuTerbuka(!menuTerbuka)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border xl:hidden"
        >
          {menuTerbuka ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuTerbuka && (
        <div className="border-t border-border bg-card px-6 py-4 xl:hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMenuTerbuka(false)}
                  className={
                    aktif(item)
                      ? "block rounded-lg bg-[#eef4ff] px-3 py-2.5 text-base font-bold text-brand-blue"
                      : "block rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/stem"
            onClick={() => setMenuTerbuka(false)}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white"
          >
            <Atom className="h-[18px] w-[18px]" />
            STEM
          </Link>
        </div>
      )}
    </header>
  )
}