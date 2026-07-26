import { ArrowRight, Star } from "lucide-react"

const classes = [
  {
    level: "Kelas 4",
    href: "/kelas/4",
    image: "/images/kelas-4.png",
    alt: "Ilustrasi siswa kelas 4 belajar TIK dengan laptop",
    cardClass: "bg-[#eef4ff] border-[#dbe6ff]",
    titleClass: "text-brand-blue",
    buttonClass: "bg-brand-blue hover:bg-brand-blue-dark",
  },
  {
    level: "Kelas 5",
    href: "/kelas/5",
    image: "/images/kelas-5.png",
    alt: "Ilustrasi siswi kelas 5 berhijab belajar TIK",
    cardClass: "bg-[#eefbf1] border-[#d5f0dd]",
    titleClass: "text-brand-green",
    buttonClass: "bg-brand-green hover:brightness-95",
  },
  {
    level: "Kelas 6",
    href: "/kelas/6",
    image: "/images/kelas-6.png",
    alt: "Ilustrasi siswa kelas 6 belajar TIK dengan tablet",
    cardClass: "bg-[#f4eefe] border-[#e6d9fb]",
    titleClass: "text-brand-purple",
    buttonClass: "bg-brand-purple hover:brightness-95",
  },
]

export function ClassSection() {
  return (
    <section id="materi" className="py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-center justify-center gap-4">
          <span className="h-0.5 w-12 rounded-full bg-brand-blue" />
          <Star className="h-6 w-6 fill-brand-amber text-brand-amber" />
          <h3 className="text-3xl font-extrabold">Pilih Kelas Kamu</h3>
          <Star className="h-6 w-6 fill-brand-amber text-brand-amber" />
          <span className="h-0.5 w-12 rounded-full bg-brand-blue" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {classes.map((item) => (
            <div
              key={item.level}
              className={`grid min-h-52 grid-cols-[1fr_auto] items-center overflow-hidden rounded-3xl border py-6 pl-7 ${item.cardClass}`}
            >
              <div className="flex flex-col gap-1.5">
                <h4 className={`text-3xl font-extrabold ${item.titleClass}`}>{item.level}</h4>
                <p className="mb-4 text-base text-brand-muted">Pelajaran TIK</p>
                <a href={item.href}>
                  <button
                    className={`inline-flex items-center gap-2 self-start rounded-xl px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 ${item.buttonClass}`}
                  >
                    Masuk Kelas
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
              </div>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.alt}
                className="h-full min-h-52 w-[150px] object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
