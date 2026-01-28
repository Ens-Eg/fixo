import dynamic from "next/dynamic";
import HeroBanner from "@/components/FrontPage/HeroBanner";
import HowItWorks from "@/components/FrontPage/HowItWorks";
import FeaturesSection from "@/components/FrontPage/FeaturesSection";
import Navbar from "@/components/FrontPage/Navbar";
import CTA from "@/components/FrontPage/Cta";

// Dynamically import heavy components below the fold to reduce initial CSS bundle
const PricingSection = dynamic(() => import("@/components/FrontPage/PricingSection"), {
  ssr: true, // Keep SSR for SEO
});
const TemplatesShow = dynamic(() => import("@/components/FrontPage/TemplatesShow"), {
  ssr: true,
});
const FAQ = dynamic(() => import("@/components/FrontPage/FAQ"), {
  ssr: true,
});
// Below-the-fold components - load after initial paint
// Note: ssr: false is not allowed in Server Components, so we use default (ssr: true)
// The components themselves are Client Components and will hydrate on the client
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
