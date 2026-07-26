import { BookOpen, Play, Pencil, Gamepad2, ShieldCheck } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    iconClass: "bg-brand-blue",
    title: "Materi Lengkap",
    desc: "Materi TIK disusun sesuai kebutuhan siswa SD.",
  },
  {
    icon: Play,
    iconClass: "bg-brand-green",
    title: "Video Menarik",
    desc: "Video pembelajaran interaktif yang mudah dipahami.",
  },
  {
    icon: Pencil,
    iconClass: "bg-brand-amber",
    title: "Latihan Soal",
    desc: "Uji pemahaman dengan soal interaktif dan beragam.",
  },
  {
    icon: Gamepad2,
    iconClass: "bg-brand-purple",
    title: "Game Edukasi",
    desc: "Belajar seru dengan game yang mendidik.",
  },
  {
    icon: ShieldCheck,
    iconClass: "bg-brand-sky",
    title: "Aman & Terpercaya",
    desc: "Konten aman, positif, dan sesuai untuk siswa SD.",
  },
]

export function WhySection() {
  return (
    <section id="info" className="mx-auto max-w-7xl px-6">
      <div className="mb-16 rounded-3xl border border-border bg-card p-9">
        <h3 className="mb-6 text-2xl font-extrabold text-brand-blue text-balance">
          Kenapa Belajar TIK di SD Muhammadiyah 01 Kukusan?
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="flex items-start gap-3.5 rounded-2xl border border-border bg-slate-50 p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${feature.iconClass}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="mb-1 text-base font-bold">{feature.title}</h5>
                  <p className="text-sm leading-snug text-brand-muted">{feature.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
