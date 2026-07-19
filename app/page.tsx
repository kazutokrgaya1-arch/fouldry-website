import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import PricingGrid from "@/components/PricingGrid";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialProof />
      <PricingGrid />
      <FAQ />
      <Footer />
    </>
  );
}
