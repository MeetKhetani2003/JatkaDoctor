import Image from "next/image";
import { Phone, MessageCircle, Truck, Droplets, HeartPulse, User, ShieldCheck, Clock, MapPin, CheckCircle, Video, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col pb-8">
      {/* HERO SECTION */}
      <section className="relative bg-[#e6f5ec] pt-8 pb-10 px-4 overflow-hidden">
        <div className="relative z-10 max-w-full">
          <h1 className="text-[32px] font-extrabold text-primary leading-[1.1] mb-2">
            24x7 <br />
            <span className="text-gray-900">Ambulance Service</span> <br />
            <span className="text-primary">in Lucknow</span>
          </h1>
          <p className="text-gray-600 text-sm mb-6 max-w-[200px]">
            Fast, reliable and emergency ambulance service at your doorstep.
          </p>
          <div className="flex gap-3">
            <a href="tel:8707790677" className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md active:scale-95 transition-transform">
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a href="https://wa.me/918707790677" className="bg-white text-primary border border-primary px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm active:scale-95 transition-transform">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
        {/* Abstract/Placeholder for Ambulance Image */}
        <div className="absolute right-[-20px] bottom-0 w-[240px] h-[200px] z-0">
          {/* Replace with actual ambulance image */}
          <div className="w-full h-full bg-gradient-to-tr from-gray-200 to-gray-300 rounded-tl-[100px] flex items-center justify-center opacity-80">
             <Truck className="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="px-4 pt-8">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Our Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Truck className="text-primary w-8 h-8" />, title: "Basic Ambulance", link: "/ambulance" },
            { icon: <HeartPulse className="text-primary w-8 h-8" />, title: "ICU Ambulance", link: "/icu-ambulance" },
            { icon: <Droplets className="text-primary w-8 h-8" />, title: "Lab Tests", link: "/lab-tests" },
            { icon: <User className="text-primary w-8 h-8" />, title: "Physiotherapy", link: "/physiotherapy" },
            { icon: <ShieldCheck className="text-primary w-8 h-8" />, title: "Doctor at Home", link: "/doctor" },
            { icon: <HeartPulse className="text-primary w-8 h-8" />, title: "ICU Setup", link: "/icu-setup" },
            { icon: <User className="text-primary w-8 h-8" />, title: "Medical Equip.", link: "/equipment" },
            { icon: <Truck className="text-gray-500 w-8 h-8" />, title: "Dead Body", link: "/dead-body-ambulance" },
          ].map((service, i) => (
            <Link href={service.link} key={i} className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl p-3 flex flex-col items-center text-center gap-2 active:bg-gray-50 transition-colors">
              <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-1">
                {service.icon}
              </div>
              <span className="text-[12px] font-semibold text-gray-800 leading-tight">{service.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="px-4 pt-10">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Why Choose Us?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Clock />, title: "24x7", subtitle: "Available" },
            { icon: <CheckCircle />, title: "10-15 Min", subtitle: "Response" },
            { icon: <User />, title: "Trained", subtitle: "Medical Staff" },
            { icon: <MapPin />, title: "GPS", subtitle: "Enabled" },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-xl p-3 flex flex-col items-center text-center justify-center h-24">
              <div className="text-primary w-6 h-6 mb-2">
                {item.icon}
              </div>
              <span className="text-[12px] font-bold text-gray-900 leading-tight">{item.title}</span>
              <span className="text-[11px] text-gray-500">{item.subtitle}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="px-4 pt-10">
        <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
          <MapPin className="w-8 h-8 text-primary flex-shrink-0" />
          <div className="relative z-10">
            <h3 className="font-bold text-gray-900 text-sm">Service Areas</h3>
            <p className="text-primary font-semibold text-[13px] mt-0.5">Serving in Lucknow</p>
            <p className="text-gray-500 text-[11px] mt-0.5">Other cities coming soon...</p>
          </div>
          {/* Abstract cityscape bg */}
          <div className="absolute right-0 bottom-0 opacity-10">
             <svg width="120" height="60" viewBox="0 0 120 60"><path d="M0 60 L0 30 L10 30 L10 40 L20 40 L20 20 L30 20 L30 50 L40 50 L40 10 L60 10 L60 30 L70 30 L70 15 L90 15 L90 45 L100 45 L100 25 L120 25 L120 60 Z" fill="currentColor"/></svg>
          </div>
        </div>
      </section>

      {/* QUICK BOOKING FORM */}
      <section className="px-4 pt-10">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Quick Booking</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-3">
            <User className="w-5 h-5 text-gray-400 mr-3" />
            <input type="text" placeholder="Your Name" className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400" />
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-3">
            <Phone className="w-5 h-5 text-gray-400 mr-3" />
            <input type="tel" placeholder="Phone Number" className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400" />
          </div>
          <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-3">
            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
            <input type="text" placeholder="Pickup Location" className="flex-1 outline-none text-sm text-gray-800 bg-transparent placeholder-gray-400" />
          </div>
          <button className="bg-primary text-white w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 mt-2 shadow-md active:bg-primary-dark transition-colors">
            <Truck className="w-5 h-5" />
            Book Service
          </button>
        </div>
      </section>
      
      {/* DOCTORS / PARTNERS CTA */}
      <section className="px-4 pt-10">
         <div className="bg-[#e6f5ec] rounded-xl p-5 flex items-center justify-between">
            <div>
               <h3 className="font-bold text-primary text-base">Join Our Network</h3>
               <p className="text-gray-600 text-xs mt-1 max-w-[200px]">Are you a doctor, clinic, or ambulance owner?</p>
               <Link href="/join-us" className="inline-flex items-center gap-1 text-primary font-bold text-sm mt-3">
                  Register Now <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            <ShieldCheck className="w-16 h-16 text-primary opacity-20" />
         </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-4 pt-10">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">What Our Customers Say</h2>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 snap-x">
          {[1, 2, 3].map((item) => (
            <div key={item} className="snap-center shrink-0 w-[280px] bg-white border border-gray-100 shadow-sm rounded-xl p-4">
              <div className="flex text-[#FFB800] mb-2">
                ★★★★★
              </div>
              <p className="text-gray-700 text-[13px] leading-relaxed mb-3">
                "Very fast service! Ambulance arrived within 15 minutes. Thanks to the team for the quick response."
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                 <span className="text-[12px] font-bold text-gray-900">- Rajesh Kumar</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO TESTIMONIALS PREVIEW */}
      <section className="px-4 pt-6">
        <h2 className="text-[18px] font-bold text-gray-900 mb-4">Video Reviews</h2>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar pb-4 snap-x">
          {[1, 2].map((item) => (
            <div key={item} className="snap-center shrink-0 w-[240px] h-[140px] bg-gray-200 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm absolute z-10 cursor-pointer">
                 <Play className="w-5 h-5 text-primary ml-1" />
              </div>
              <p className="absolute bottom-2 left-3 text-white text-xs font-semibold z-10 drop-shadow-md">Patient Recovery Story</p>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          ))}
        </div>
      </section>
      
      {/* FOOTER */}
      <footer className="mt-10 bg-gray-900 text-white pt-10 pb-20 px-4 rounded-t-[24px]">
         <div className="flex flex-col gap-6">
            <div>
               <h3 className="text-xl font-bold mb-2">Dr. Jhatka Medicare</h3>
               <p className="text-gray-400 text-sm">Your trusted healthcare partner at home. 24x7 Emergency services.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
               <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-gray-200 mb-1">Services</h4>
                  <Link href="/ambulance" className="text-gray-400 hover:text-white">Ambulance</Link>
                  <Link href="/lab-tests" className="text-gray-400 hover:text-white">Lab Tests</Link>
                  <Link href="/doctor" className="text-gray-400 hover:text-white">Doctor Visit</Link>
                  <Link href="/physiotherapy" className="text-gray-400 hover:text-white">Physiotherapy</Link>
               </div>
               <div className="flex flex-col gap-2">
                  <h4 className="font-semibold text-gray-200 mb-1">Company</h4>
                  <Link href="/about" className="text-gray-400 hover:text-white">About Us</Link>
                  <Link href="/gallery" className="text-gray-400 hover:text-white">Gallery</Link>
                  <Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link>
                  <Link href="/join-us" className="text-gray-400 hover:text-white">Join Network</Link>
               </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6 mt-2 text-center text-xs text-gray-500">
               © {new Date().getFullYear()} Dr. Jhatka Medicare Pvt Ltd.<br/>All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}
