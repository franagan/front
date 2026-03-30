import { Navigation } from "@/components/ui/navigation"
import HeroSection from "@/components/home/HeroSection"
import CalculatorSection from "@/components/home/CalculatorSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import FinalCTA from "@/components/home/FinalCTA"
import LandingFooter from "@/components/home/LandingFooter"

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navigation />
            <HeroSection />
            <CalculatorSection />
            <FeaturesSection />
            <TestimonialsSection />
            <FinalCTA />
            <LandingFooter />
        </div>
    )
}