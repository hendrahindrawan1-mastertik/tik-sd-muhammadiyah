import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { GuruUlasanClient } from "@/components/guru-ulasan-client"

export default function KelolaUlasanPage() {
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
          Kelola Ulasan Pengunjung
        </h2>

        <GuruUlasanClient />
      </main>
      <SiteFooter />
    </div>
  )
}