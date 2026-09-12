import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GuruSoalUTSClient } from "@/components/guru-soal-uts-client"

export default function KelolaSoalUTSPage() {
  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <a
          href="/guru/rekap-absensi"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Rekap Absensi
        </a>

        <h2 className="mb-2 text-3xl font-extrabold text-brand-blue">
          Kelola Soal UTS
        </h2>
        <p className="mb-8 text-brand-muted">
          Susun soal pilihan ganda untuk UTS. Siswa mengerjakan langsung di{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">/uts</code>, dan nilai dihitung
          otomatis oleh sistem.
        </p>

        <GuruSoalUTSClient />
      </main>
      <SiteFooter />
    </div>
  )
}
