"use client";

import { MapPin, Clock } from "lucide-react";

const activeAreas = [
  "Gomti Nagar", "Indira Nagar", "Aliganj", "Hazratganj", "Alambagh", 
  "Charbagh", "Mahanagar", "Jankipuram", "Ashiyana", "Rajajipuram", 
  "Aminabad", "Chowk", "Chinhat", "Faizabad Road", "Sitapur Road", 
  "Sultanpur Road", "Kanpur Road", "Telibagh", "Vrindavan Yojna", 
  "Kalyanpur", "Dubagga", "Bakshi Ka Talab", "Kakori", "Malihabad", 
  "Mohanlalganj", "Itaunja"
];

const expandingCities = [
  "Barabanki", "Sitapur", "Unnao", "Rae Bareli", "Hardoi", 
  "Sultanpur", "Ayodhya", "Lakhimpur", "Shahjahanpur", "Pratapgarh"
];

export default function ServiceArea() {
  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Our Service Areas</h2>
        <p className="text-base text-gray-500 mt-2">
          Comprehensive coverage across Lucknow and expanding soon to nearby cities.
        </p>
      </div>

      <div className="space-y-6">
        {/* Service Areas - Active */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 border-l-4 border-l-primary">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" /> Active Service Areas (Lucknow)
            </h3>
            <div className="inline-flex items-center gap-2 bg-green-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              24x7 Available
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeAreas.map((area) => (
              <span key={area} className="text-xs sm:text-[13px] bg-primary text-white px-3.5 py-1.5 rounded-full font-medium shadow-sm transition hover:bg-primary-dark cursor-default">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Service Areas - Expanding Soon */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 border-dashed p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-500 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" /> Expanding Soon – Nearby Cities
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {expandingCities.map((city) => (
              <span key={city} className="text-xs sm:text-[13px] bg-white text-gray-500 border border-gray-200 px-3.5 py-1.5 rounded-full font-medium cursor-default shadow-sm">
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
