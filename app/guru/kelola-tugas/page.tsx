import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GuruTugasClient } from "@/components/guru-tugas-client"

export default function KelolaTugasPage() {
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

        <h2 className="mb-8 text-3xl font-extrabold text-brand-blue">
          Kelola Tugas
        </h2>

        <GuruTugasClient />
      </main>
      <SiteFooter />
    </div>
  )
}