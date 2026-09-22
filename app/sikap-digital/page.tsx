import { ArrowLeft, ArrowRight, Keyboard, Monitor, Star, Clock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const materi = [
  {
    icon: Keyboard,
    title: "Karya Buatan Sendiri",
    desc: "Jangan asal copy-paste karya orang lain ya! Tuliskan sumbernya jika kamu mengambil gambar atau tulisan dari internet.",
  },
  {
    icon: Monitor,
    title: "Jaga Fasilitas Sekolah",
    desc: "Komputer dan mouse sekolah adalah milik bersama. Gunakan dengan hati-hati dan jangan sampai merusaknya.",
  },
  {
    icon: Star,
    title: "Jujur Saat Mengerjakan Tugas",
    desc: "Kirimkan hasil kerjamu sendiri. Mengirimkan file milik teman itu tidak jujur, loh!",
  },
  {
    icon: Clock,
    title: "Gunakan Waktu dengan Bijak",
    desc: "Pakai jam pelajaran TIK untuk belajar hal baru, bukan untuk membuka hal yang tidak berhubungan dengan materi.",
  },
]

export default function SikapDigitalPage() {
  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <a
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </a>

        <h2 className="mb-1 text-3xl font-extrabold text-brand-red">
          Pahlawan Digital: Jujur & Bertanggung Jawab!
        </h2>
        <p className="mb-8 text-brand-muted">4 langkah mudah jadi siswa hebat di lab TIK</p>

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          {materi.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h5 className="mb-1.5 text-base font-bold">{item.title}</h5>
                <p className="text-sm leading-snug text-brand-muted">{item.desc}</p>
              </div>
            )
          })}
        </div>

        <a href="/sikap-digital/kuis">
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
            Uji Kejujuran Digitalmu
            <ArrowRight className="h-4 w-4" />
          </button>
        </a>
      </main>
      <SiteFooter />
    </div>
  )
}
