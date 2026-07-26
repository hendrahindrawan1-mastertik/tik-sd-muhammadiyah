import { UserRound } from "lucide-react"

const navItems = [
  { label: "Beranda", href: "#beranda", active: true },
  { label: "Materi", href: "#materi" },
  { label: "Video", href: "/video" },
  { label: "Soal", href: "/soal" },
  { label: "Game", href: "#game" },
  { label: "Info", href: "#info" },
  { label: "Untuk Guru", href: "#guru" },
]

export function SiteHeader() {
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
                <a
                  href={item.href}
                  className={
                    item.active
                      ? "border-b-[3px] border-brand-blue pb-1.5 text-base font-bold text-brand-blue"
                      : "pb-1.5 text-base font-medium text-slate-700 transition-colors hover:text-brand-blue"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#profil-guru">
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 transition-transform hover:-translate-y-0.5 hover:bg-brand-blue-dark">
            <UserRound className="h-[18px] w-[18px]" />
            Profil Guru
          </button>
        </a>
      </div>
    </header>
  )
}
