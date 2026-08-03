import { ArrowLeft, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

const kelasList = [
  { level: 4, cardClass: "bg-[#eef4ff] border-[#dbe6ff]", titleClass: "text-brand-blue", buttonClass: "bg-brand-blue hover:bg-brand-blue-dark" },
  { level: 5, cardClass: "bg-[#eefbf1] border-[#d5f0dd]", titleClass: "text-brand-green", buttonClass: "bg-brand-green hover:brightness-95" },
  { level: 6, cardClass: "bg-[#f4eefe] border-[#e6d9fb]", titleClass: "text-brand-purple", buttonClass: "bg-brand-purple hover:brightness-95" },
]

export default function TugasPage() {
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

        <h2 className="mb-8 text-3xl font-extrabold text-brand-blue">
          Pilih Kelas untuk Lihat Tugas
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {kelasList.map((item) => (
            <div
              key={item.level}
              className={`flex flex-col items-start gap-3 rounded-3xl border p-7 ${item.cardClass}`}
            >
              <h3 className={`text-2xl font-extrabold ${item.titleClass}`}>Kelas {item.level}</h3>
              <p className="text-sm text-brand-muted">Tugas & lembar kerja</p>
              <a href={`/tugas/${item.level}`}>
                <button className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 ${item.buttonClass}`}>
                  Lihat Tugas
                  <ArrowRight className="h-4 w-4" />
                </button>
              </a>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}