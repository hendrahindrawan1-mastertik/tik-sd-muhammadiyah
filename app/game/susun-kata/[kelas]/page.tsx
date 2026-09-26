import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SusunKataClient } from "@/components/susun-kata-client"

const VALID_LEVELS = [4, 5, 6] as const

export default async function SusunKataKelasPage({
  params,
}: {
  params: Promise<{ kelas: string }>
}) {
  const { kelas } = await params
  const kelasNumber = Number(kelas)

  if (!VALID_LEVELS.includes(kelasNumber as 4 | 5 | 6)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <a
          href="/game"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Menu Game
        </a>

        <h2 className="mb-8 text-3xl font-extrabold text-brand-purple">
          Susun Kata &mdash; Kelas {kelasNumber}
        </h2>

        <SusunKataClient kelas={kelasNumber as 4 | 5 | 6} />
      </main>
      <SiteFooter />
    </div>
  )
}
