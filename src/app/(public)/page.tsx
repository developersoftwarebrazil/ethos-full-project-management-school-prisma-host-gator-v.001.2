import Hero from "@/components/landing/hero/Hero";
import About from "@/components/landing/about/About";
import Highlights from "@/components/landing/highlights/Highlights";
import Benefits from "@/components/landing/benefits/Benefits";
import FAQ from "@/components/landing/faq/FAQ";
import CTA from "@/components/landing/cta/CTA";
import Contact from "@/components/landing/contact/Contact";
import LandingHeader from "@/components/landing/header/LandingHeader";
import LandingFooter from "@/components/landing/footer/LandingFooter";

export default function PublicHomePage() {
  return (
    <>
      <LandingHeader />
      <Hero />
      <About />
      <Benefits />
      <Highlights />
      <FAQ />
      <CTA />
      <Contact />
      <LandingFooter />
    </>
  );
}
