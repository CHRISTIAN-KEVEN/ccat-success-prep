'use client'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/layout/HeroSection'
import FeaturesSection from '@/components/layout/FeaturesSection'
import PricingSection from '@/components/layout/PricingSection'
import TestimonialsSection from '@/components/layout/TestimonialsSection'
import FAQSection from '@/components/layout/FAQSection'
import CTASection from '@/components/layout/CTASection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-col flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
