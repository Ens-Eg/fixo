import dynamic from "next/dynamic";
import HeroBanner from "@/components/FrontPage/HeroBanner";
import Navbar from "@/components/FrontPage/Navbar";
import CTA from "@/components/FrontPage/Cta";

// Dynamically import below-the-fold components to reduce initial CSS bundle
// These components load after initial paint, reducing render-blocking CSS
const TemplatesShow = dynamic(() => import("@/components/FrontPage/TemplatesShow"), {
  ssr: true, // Keep SSR for SEO
});
const FeaturesSection = dynamic(() => import("@/components/FrontPage/FeaturesSection"), {
  ssr: true, // Keep SSR for SEO
});
const HowItWorks = dynamic(() => import("@/components/FrontPage/HowItWorks"), {
  ssr: true, // Keep SSR for SEO
});
const PricingSection = dynamic(() => import("@/components/FrontPage/PricingSection"), {
  ssr: true, // Keep SSR for SEO
});
const FAQ = dynamic(() => import("@/components/FrontPage/FAQ"), {
  ssr: true, // Keep SSR for SEO
});
const ContactSection = dynamic(() => import("@/components/FrontPage/ContactSection"), {
  ssr: true, // Keep SSR for initial render, component will hydrate on client
});
const Footer = dynamic(() => import("@/components/FrontPage/Footer"), {
  ssr: true, // Keep SSR for initial render, component will hydrate on client
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

        <ContactSection />

        <Footer />
      </div>
    </>
  );
}
