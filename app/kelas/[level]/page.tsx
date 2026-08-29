import { notFound } from "next/navigation"
import { ArrowLeft, PlayCircle, Download } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getMateriByKelas } from "@/lib/supabase/queries"

const VALID_LEVELS = [4, 5, 6] as const

const THEME: Record<number, { bg: string; border: string; title: string; button: string }> = {
  4: { bg: "bg-[#eef4ff]", border: "border-[#dbe6ff]", title: "text-brand-blue", button: "bg-brand-blue hover:bg-brand-blue-dark" },
  5: { bg: "bg-[#eefbf1]", border: "border-[#d5f0dd]", title: "text-brand-green", button: "bg-brand-green hover:brightness-95" },
  6: { bg: "bg-[#f4eefe]", border: "border-[#e6d9fb]", title: "text-brand-purple", button: "bg-brand-purple hover:brightness-95" },
}

function toEmbedUrl(url: string) {
  // Ubah link YouTube biasa (watch?v=... atau youtu.be/...) menjadi link embed
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }
    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v")
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  } catch {
    return url
  }
}

export default async function KelasPage({
  params,
}: {
  params: Promise<{ level: string }>
}) {
  const { level } = await params
  const kelasNumber = Number(level)

  if (!VALID_LEVELS.includes(kelasNumber as 4 | 5 | 6)) {
    notFound()
  }

  const materi = await getMateriByKelas(kelasNumber as 4 | 5 | 6)
  const theme = THEME[kelasNumber]

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

        <h2 className={`mb-4 text-3xl font-extrabold ${theme.title}`}>
          Materi TIK Kelas {kelasNumber}
        </h2>

        <div className={`mb-8 flex flex-col items-start gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${theme.bg} ${theme.border}`}>
          <div>
            <h5 className="text-base font-bold">📄 Modul Belajar Kelas {kelasNumber} (PDF)</h5>
            <p className="text-sm text-brand-muted">Download modul untuk membantu belajar di rumah.</p>
          </div>
          <a href={`/modul/modul-kelas-${kelasNumber}.pdf`} download className="w-full sm:w-auto">
            <button className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto ${theme.button}`}>
              Download PDF
              <Download className="h-4 w-4" />
            </button>
          </a>
        </div>

        {materi.length === 0 ? (
          <p className="text-brand-muted">
            Belum ada materi untuk kelas ini. Materi akan tampil di sini setelah ditambahkan oleh guru.
          </p>
        ) : (
          <div className="grid gap-6">
            {materi.map((item) => (
              <article
                key={item.id}
                className={`rounded-3xl border p-6 ${theme.bg} ${theme.border}`}
              >
                <h3 className="mb-2 text-xl font-bold">{item.judul}</h3>
                {item.deskripsi && (
                  <p className="mb-4 text-brand-muted">{item.deskripsi}</p>
                )}
                {item.video_url ? (
                  <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black/5">
                    <iframe
                      src={toEmbedUrl(item.video_url)}
                      title={item.judul}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm text-brand-muted">
                    <PlayCircle className="h-4 w-4" />
                    Belum ada video untuk materi ini
                  </span>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
