import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GuruRekapClient } from "@/components/guru-rekap-client"

export default function RekapAbsensiPage() {
  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </a>

        <h2 className="mb-8 text-3xl font-extrabold text-brand-blue">
          Rekap Absensi Siswa
        </h2>

        <GuruRekapClient />
      </main>
      <SiteFooter />
    </div>
  )
}