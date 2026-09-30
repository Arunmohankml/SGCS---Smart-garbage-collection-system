import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AiFeatures } from "@/components/landing/ai-features";
import { Municipality } from "@/components/landing/municipality";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Top Hero Section */}
        <Hero />

        {/* 4-Step Process Section */}
        <HowItWorks />

        {/* Smart Operations & Segregation */}
        <AiFeatures />

        {/* Government Admin Dispatch Overview */}
        <Municipality />

        {/* FAQ Section */}
        <div id="faq">
          <Faq />
        </div>

        {/* Call to Action */}
        <Cta />
      </main>
      <Footer />
    </>
  );
}