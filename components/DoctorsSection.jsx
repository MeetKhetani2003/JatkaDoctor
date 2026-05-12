import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Star, BadgeCheck, CalendarCheck, Loader2 } from "lucide-react";

const phone = "8874744756";

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Only show top 4 for this section
          setDoctors(data.slice(0, 4));
        }
      } catch (e) {
        console.error("Error fetching doctors:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="px-4 pt-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Our Doctors</h2>
          <p className="text-sm text-gray-500 mt-0.5">Verified & Experienced</p>
        </div>
        <Link 
          href="/our-medical-team"
          className="text-sm text-primary font-bold cursor-pointer hover:text-primary-dark transition"
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc._id || doc.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_24px_rgba(15,157,88,0.08)] transition-all flex flex-col"
            >
              {/* IMAGE - fixed aspect ratio */}
              <div className="relative w-full aspect-[4/5] sm:aspect-square">
                <Image
                  src={
                    doc.imageFileId
                      ? `/api/images/${doc.imageFileId}`
                      : doc.image ||
                        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
                  }
                  alt={doc.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />

                {/* VERIFIED BADGE - top left */}
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold shadow-sm">
                  <BadgeCheck className="w-3 h-3" />
                  VERIFIED
                </div>

                {/* RATING - top right */}
                <div className="absolute top-2 right-2 bg-white/95 px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  {doc.rating || "4.9"}
                </div>
              </div>

              {/* CONTENT - flex grow to push button down */}
              <div className="p-3 sm:p-4 flex flex-col flex-1">
                {/* NAME - single line with ellipsis */}
                <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                  {doc.name}
                </h3>

                {/* DEGREE */}
                <p className="text-xs sm:text-sm text-primary font-semibold mt-0.5">
                  {doc.degree || "MD / MBBS"}
                </p>

                {/* ROLE + EXP - single line */}
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 truncate">
                  {doc.role} • {doc.experience || doc.exp || "5+ Years"}
                </p>

                {/* BUTTON - always at bottom */}
                <div className="mt-auto pt-3">
                  <Link
                    href={doc.slug ? `/doctor/${doc.slug}` : `/book?service=doctor&doctor=${doc.name}`}
                    className="w-full flex items-center justify-center gap-2 
                    bg-primary text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold 
                    active:scale-95 transition hover:bg-primary-dark"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
