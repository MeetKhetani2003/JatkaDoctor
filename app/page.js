import BlogSection from "@/components/Blogs";
import DoctorsSection from "@/components/DoctorsSection";
import EmergencyCTA from "@/components/EmergencyCTA";
import GallerySection from "@/components/Gallery";
import HeroCarousel from "@/components/HeroCarousel";
import HowItWorks from "@/components/HowitWorks";
import PartnersSection from "@/components/OurClinicsAndPartners";
import ServicesGrid from "@/components/ServiceGrid";
import ServiceArea from "@/components/ServiceLocation";
import VideoTestimonials from "@/components/VideoTestimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import React from "react";

const Home = () => {
  return (
    <div>
      <HeroCarousel />
      <ServicesGrid />
      <WhyChooseUs />
      <HowItWorks />
      <DoctorsSection />
      <PartnersSection />
      <VideoTestimonials />
      <BlogSection />
      <GallerySection />
      <EmergencyCTA />
      <ServiceArea />
    </div>
  );
};

export default Home;
