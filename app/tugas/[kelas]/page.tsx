import { notFound } from "next/navigation"
import { ArrowLeft, FileDown, Link2, CalendarClock } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getTugasByKelas } from "@/lib/supabase/queries"

const VALID_LEVELS = [4, 5, 6] as const

const THEME: Record<number, { bg: string; border: string; title: string }> = {
  4: { bg: "bg-[#eef4ff]", border: "border-[#dbe6ff]", title: "text-brand-blue" },
  5: { bg: "bg-[#eefbf1]", border: "border-[#d5f0dd]", title: "text-brand-green" },
  6: { bg: "bg-[#f4eefe]", border: "border-[#e6d9fb]", title: "text-brand-purple" },
}

function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function TugasKelasPage({
  params,
}: {
  params: Promise<{ kelas: string }>
}) {
  const { kelas } = await params
  const kelasNumber = Number(kelas)

  if (!VALID_LEVELS.includes(kelasNumber as 4 | 5 | 6)) {
    notFound()
  }

  const daftarTugas = await getTugasByKelas(kelasNumber as 4 | 5 | 6)
  const theme = THEME[kelasNumber]

  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        
          href="/tugas"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Pilih Kelas Lain
        </a>

        <h2 className={`mb-8 text-3xl font-extrabold ${theme.title}`}>
          Tugas Kelas {kelasNumber}
        </h2>

        {daftarTugas.length === 0 ? (
          <p className="text-brand-muted">
            Belum ada tugas untuk kelas ini. Tugas akan tampil di sini setelah ditambahkan oleh guru.
          </p>
        ) : (
          <div className="grid gap-6">
            {daftarTugas.map((t) => (
              <article
                key={t.id}
                className={`rounded-3xl border p-6 ${theme.bg} ${theme.border}`}
              >
                <h3 className="mb-2 text-xl font-bold">{t.judul}</h3>
                {t.deskripsi && (
                  <p className="mb-3 text-brand-muted">{t.deskripsi}</p>
                )}
                {t.tenggat && (
                  <p className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-muted">
                    <CalendarClock className="h-4 w-4" />
                    Batas waktu: {formatTanggal(t.tenggat)}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {t.pdf_url && (
                    <a href={t.pdf_url} target="_blank" rel="noopener noreferrer">
                      <button className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5">
                        <FileDown className="h-4 w-4" />
                        Download / Cetak PDF
                      </button>
                    </a>
                  )}
                  {t.link_url && (
                    <a href={t.link_url} target="_blank" rel="noopener noreferrer">
                      <button className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-[#dbe3f4] bg-card px-5 py-2.5 text-sm font-semibold text-brand-blue transition-transform hover:-translate-y-0.5">
                        <Link2 className="h-4 w-4" />
                        Buka Link Tugas
                      </button>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}