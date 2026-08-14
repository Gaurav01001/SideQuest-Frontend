import { HeroSection } from "@/components/ui/hero-section-with-smooth-bg-shader"

export default function LandingPage() {
    return (
        <HeroSection
            distortion={1.2}
            speed={0.5}
            swirl={0.7}
        />
    )
}
