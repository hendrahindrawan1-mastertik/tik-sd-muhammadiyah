import { BookOpen, MessageSquareHeart, ClipboardCheck } from "lucide-react"

const HERO_IMAGE = "/images/hero-ilustrasi.jpg"

export function HeroSection() {
  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-gradient-to-b from-[#eef3ff] to-[#f7f9ff] py-12 pb-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3.5 text-lg text-brand-muted text-pretty">
              Selamat Datang di SD Muhammadiyah 01 Kukusan 👋
            </p>
            <h2 className="mb-5 text-5xl font-extrabold leading-[1.05] tracking-tight text-balance lg:text-6xl">
              Belajar TIK
              <br />
              Jadi <span className="text-brand-blue">Mudah &amp; Seru!</span>
            </h2>
            <p className="mb-8 max-w-md text-lg text-brand-muted text-pretty">
              Temukan materi, video pembelajaran, latihan soal, dan game edukasi untuk siswa SD kelas 4, 5, dan 6.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#materi">
                <button className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-blue/25 transition-transform hover:-translate-y-0.5 hover:bg-brand-blue-dark">
                  <BookOpen className="h-[18px] w-[18px]" />
                  Mulai Belajar
                </button>
              </a>
              <a href="/ulasan">
                <button className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-[#dbe3f4] bg-card px-6 py-3.5 text-base font-semibold text-brand-blue transition-transform hover:-translate-y-0.5">
                  <MessageSquareHeart className="h-[18px] w-[18px]" />
                  Beri Ulasan
                </button>
              </a>
              <a href="/absen">
                <button className="inline-flex items-center gap-2 rounded-xl bg-brand-green px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-green/25 transition-transform hover:-translate-y-0.5 hover:brightness-95">
                  <ClipboardCheck className="h-[18px] w-[18px]" />
                  Absen Sekarang
                </button>
              </a>
            </div>
          </div>

          <div>
            <div className="animate-float rounded-3xl border border-[#eef2f7] bg-card p-6 shadow-2xl shadow-slate-900/10">
              <img
                src={HERO_IMAGE || "/placeholder.svg"}
                alt="Ilustrasi dua siswa SD sedang belajar TIK dengan laptop"
                className="block h-80 w-full rounded-2xl object-cover [object-position:62%_30%]"
              />
            </div>
            <div className="relative -mt-12 ml-3 flex w-max items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-lg shadow-slate-900/10">
              <img
                src="/images/guru-supitriatna.png"
                alt="Foto Guru Pengampu Supitriatna Hindrawan"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <small className="block text-xs text-brand-muted">Guru Pengampu</small>
                <strong className="text-[15px]">Supitriatna Hindrawan</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}