import dynamic from "next/dynamic";
import ContactSection from "@/components/FrontPage/ContactSection";
import Footer from "@/components/FrontPage/Footer";
import HeroBanner from "@/components/FrontPage/HeroBanner";
import HowItWorks from "@/components/FrontPage/HowItWorks";
import FeaturesSection from "@/components/FrontPage/FeaturesSection";
import Navbar from "@/components/FrontPage/Navbar";
import CTA from "@/components/FrontPage/Cta";

// Dynamically import heavy components to reduce initial CSS bundle
const PricingSection = dynamic(() => import("@/components/FrontPage/PricingSection"), {
  ssr: true, // Keep SSR for SEO
});
const TemplatesShow = dynamic(() => import("@/components/FrontPage/TemplatesShow"), {
  ssr: true,
});
const FAQ = dynamic(() => import("@/components/FrontPage/FAQ"), {
  ssr: true,
});

export default function Home() {
  return (
    <>
      <div className="front-page-body overflow-hidden">
        <Navbar />

        <HeroBanner />

        <TemplatesShow />

        <div id="features">
          <FeaturesSection />
        </div>

        <div id="use-cases">
          <HowItWorks />
        </div>

        <div id="pricing">
          <PricingSection />
        </div>

        <FAQ />

        <CTA />

        <Footer />
      </div>
    </>
  );
}
