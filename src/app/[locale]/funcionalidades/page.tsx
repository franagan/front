import { Navigation } from "@/components/ui/navigation"
import LandingFooter from "@/components/home/LandingFooter"
import FeaturesHero from "@/components/funcionalidades/FeaturesHero"
import FeatureList from "@/components/funcionalidades/FeatureList"
import PricingSection from "@/components/funcionalidades/PricingSection"
import ContactSection from "@/components/funcionalidades/ContactSection"

export default function FuncionalidadesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <FeaturesHero />
            <FeatureList />
            <PricingSection />
            <ContactSection />
            <LandingFooter />
        </div>
    )
}
