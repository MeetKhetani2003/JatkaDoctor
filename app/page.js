import BlogSection from "@/components/Blogs";
import DoctorsSection from "@/components/DoctorsSection";
import EmergencyCTA from "@/components/EmergencyCTA";
import Footer from "@/components/Footer";
import FounderSection from "@/components/FounderSection";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import HowItWorks from "@/components/HowitWorks";
import PartnersSection from "@/components/OurClinicsAndPartners";
import ServiceArea from "@/components/ServiceArea";
import ServicesGrid from "@/components/ServiceGrid";
import StatsStrip from "@/components/StatsStrip";
import StickyBottomBar from "@/components/StickyBottomBar";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import WhyChooseUs from "@/components/WhyChooseUs";
import FAQSection from "@/components/FAQSection";

const homeFaqs = [
  { q: "Q1. Kya sach me doctor ghar par available hai 24/7?", a: "Haan, Dr Jhatka Medicare me 24/7 doctor support available hai. Emergency aur urgent cases me nearest available doctor ko turant assign kiya jata hai." },
  { q: "Q2. Kitni jaldi doctor ya ambulance mil jati hai?", a: "Fast response system ke through urgent cases me 15–20 minutes me doctor ya ambulance arrange kiya jata hai (selected areas)." },
  { q: "Q3. Kya ye service Lucknow me har jagah available hai?", a: "Haan, Dr Jhatka Medicare Lucknow ke sabhi major areas me fast home healthcare service provide karta hai." },
  { q: "Q4. Kya hospital jaane ki zarurat nahi padegi?", a: "Minor aur moderate conditions me doctor ghar par aakar treatment de dete hain, jisse hospital jaane ki zarurat kam ho jati hai." },
  { q: "Q5. Kya booking turant ho jati hai?", a: "Haan, aap call ya WhatsApp karte hi hamari team turant response deti hai aur service arrange karti hai." }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <Header />
      <HeroCarousel />
      <ServicesGrid />
      <StatsStrip />
      <WhyChooseUs />
      <HowItWorks />
      <DoctorsSection />
      <PartnersSection />
      <Testimonials />
      <TrustBadges />
      <BlogSection />
      <FounderSection />
      <EmergencyCTA />
      <FAQSection title="FREQUENTLY ASKED QUESTIONS" faqs={homeFaqs} />
      <ServiceArea />
      <StickyBottomBar />
    </main>
  );
}
