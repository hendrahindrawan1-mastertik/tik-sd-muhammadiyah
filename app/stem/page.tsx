import { ArrowLeft, Atom, Sparkles } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function StemPage() {
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

        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue text-white">
            <Atom className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-3xl font-extrabold text-brand-blue">Materi STEM</h2>
          <p className="mx-auto mb-1 max-w-md text-brand-muted">
            Halaman ini sedang disiapkan. Materi TIK yang dipadukan dengan pendekatan STEM (Science,
            Technology, Engineering, Mathematics) akan segera hadir di sini.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue">
            <Sparkles className="h-4 w-4" />
            Segera hadir
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
