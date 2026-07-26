import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { QuizClient } from "@/components/quiz-client"
import { getSoalByKelas } from "@/lib/supabase/queries"

const VALID_LEVELS = [4, 5, 6] as const

export default async function SoalKelasPage({
  params,
}: {
  params: Promise<{ kelas: string }>
}) {
  const { kelas } = await params
  const kelasNumber = Number(kelas)

  if (!VALID_LEVELS.includes(kelasNumber as 4 | 5 | 6)) {
    notFound()
  }

  const soalList = await getSoalByKelas(kelasNumber as 4 | 5 | 6)

  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <a
          href="/soal"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Pilih Kelas Lain
        </a>

        <h2 className="mb-8 text-3xl font-extrabold text-brand-blue">
          Latihan Soal Kelas {kelasNumber}
        </h2>

        <QuizClient kelas={kelasNumber as 4 | 5 | 6} soalList={soalList} />
      </main>
      <SiteFooter />
    </div>
  )
}