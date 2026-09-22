import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SikapDigitalQuizClient } from "@/components/sikap-digital-quiz-client"

export default function SikapDigitalKuisPage() {
  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <a
          href="/sikap-digital"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Materi
        </a>

        <h2 className="mb-8 text-3xl font-extrabold text-brand-red">Kuis Kejujuran Digital</h2>

        <SikapDigitalQuizClient />
      </main>
      <SiteFooter />
    </div>
  )
}
