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
      <ServiceArea />
      <StickyBottomBar />
    </main>
  );
}
