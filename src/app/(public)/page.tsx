import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Highlights from "@/components/landing/Highlights";
import Benefits from "@/components/landing/Benefits";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

export default function PublicHomePage() {
  return (
    <>
    <LandingHeader />
      <Hero />
      <About />
      <Highlights />
      <Benefits />
      <FAQ />
      <CTA />
    <LandingFooter />
    </>
  );
}
