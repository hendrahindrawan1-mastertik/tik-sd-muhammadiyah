import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ClassSection } from "@/components/class-section"
import { WhySection } from "@/components/why-section"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-brand-ink">
      <SiteHeader />
      <main>
        <HeroSection />
        <ClassSection />
        <WhySection />
      </main>
      <SiteFooter />
    </div>
  )
}
