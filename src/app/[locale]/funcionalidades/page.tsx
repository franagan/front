import { Navigation } from "@/components/ui/navigation"
import LandingFooter from "@/components/home/LandingFooter"
import ContactSection from "@/components/funcionalidades/ContactSection"
import FeatureList from "@/components/funcionalidades/FeatureList"
import FeaturesHero from "@/components/funcionalidades/FeaturesHero"
import PricingSection from "@/components/funcionalidades/PricingSection"


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
