"use client";

import React, { useState, useMemo } from "react";
import { 
  MapPin, 
  Navigation, 
  Search, 
  X, 
  Check, 
  Loader2, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  Map,
  ExternalLink 
} from "lucide-react";
import { useLocation, LUCKNOW_PINCODES } from "@/context/LocationContext";
import { LUCKNOW_ZONES, detectZone } from "@/lib/zones";

export default function LocationModal() {
  const { 
    currentLocation, 
    isModalOpen, 
    closeLocationModal, 
    requestCurrentLocation, 
    selectManualLocation,
    geoLoading,
    geoError,
    setGeoError
  } = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [googleMapInput, setGoogleMapInput] = useState("");

  // Flattened list of Lucknow areas with their zones
  const allLucknowAreas = useMemo(() => {
    const list = [];
    for (const [zone, areas] of Object.entries(LUCKNOW_ZONES)) {
      for (const area of areas) {
        list.push({ area, zone });
      }
    }
    return list;
  }, []);

  // Filtered areas / pincodes based on user search
  const filteredSuggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];

    const matchedAreas = allLucknowAreas.filter(
      item => item.area.toLowerCase().includes(q) || item.zone.toLowerCase().includes(q)
    );

    const matchedPincodes = Object.entries(LUCKNOW_PINCODES)
      .filter(([pin, data]) => pin.includes(q) || data.area.toLowerCase().includes(q))
      .map(([pin, data]) => ({ area: `${data.area} (${pin})`, zone: data.zone, pincode: pin }));

    return [...matchedPincodes, ...matchedAreas].slice(0, 8);
  }, [searchTerm, allLucknowAreas]);

  // Popular quick chips
  const popularAreas = [
    "Gomti Nagar", 
    "Indira Nagar", 
    "Aliganj", 
    "Hazratganj", 
    "Alambagh", 
    "Jankipuram", 
    "Chowk", 
    "Charbagh",
    "Chinhat",
    "Ashiyana"
  ];

  if (!isModalOpen) return null;

  const handleUseCurrentLocation = async () => {
    const res = await requestCurrentLocation();
    if (res.success) {
      closeLocationModal();
    }
  };

  const handleSelectArea = (areaName, pincode = "") => {
    selectManualLocation(areaName, pincode);
    closeLocationModal();
  };

  const handleGoogleMapsSubmit = (e) => {
    e.preventDefault();
    if (!googleMapInput.trim()) return;
    selectManualLocation(googleMapInput.trim());
    closeLocationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Choose Your Location</h3>
              <p className="text-xs text-gray-500 font-medium">
                Serving all major zones across Lucknow 24x7
              </p>
            </div>
          </div>
          <button
            onClick={closeLocationModal}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Option 1: Use Current Location */}
          <div>
            <button
              type="button"
              id="use-current-location-btn"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-800 transition-all font-semibold text-sm group cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                  {geoLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 group-hover:text-emerald-800">
                    {geoLoading ? "Detecting GPS location..." : "Use Current Location"}
                  </div>
                  <div className="text-xs text-emerald-700/80 font-normal">
                    Detect automatically via device GPS
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
                Instant
              </span>
            </button>

            {/* Graceful error / denial notification */}
            {geoError && (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold">Location Access Notice:</span> {geoError}
                </div>
                <button 
                  onClick={() => setGeoError("")} 
                  className="text-amber-500 hover:text-amber-700 text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Option 2: Search Area or Pincode */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Search Area or Pincode
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                id="search-area-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type area (e.g. Gomti Nagar, 226010, Hazratganj)..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-emerald-500 focus:bg-white text-sm outline-none transition-all placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filtered suggestions list */}
            {filteredSuggestions.length > 0 && (
              <div className="mt-2 bg-gray-50 rounded-xl border border-gray-200 divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectArea(item.area, item.pincode)}
                    className="w-full px-4 py-2.5 text-left hover:bg-emerald-50/70 flex items-center justify-between text-xs transition-colors"
                  >
                    <span className="font-semibold text-gray-800">{item.area}</span>
                    <span className="text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {item.zone}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Option 3: Popular Lucknow Areas */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Popular Lucknow Areas
            </label>
            <div className="flex flex-wrap gap-2">
              {popularAreas.map((area) => {
                const isSelected = currentLocation.area === area;
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleSelectArea(area)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Option 4: Google Maps Integration / Address */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-emerald-600" /> Google Maps Address or Landmark
            </label>
            <form onSubmit={handleGoogleMapsSubmit} className="flex gap-2">
              <input
                type="text"
                value={googleMapInput}
                onChange={(e) => setGoogleMapInput(e.target.value)}
                placeholder="House No, Street, Landmark via Google Maps..."
                className="flex-1 px-3.5 py-2.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:border-emerald-500 focus:bg-white text-xs outline-none transition-all placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all whitespace-nowrap"
              >
                Set Address
              </button>
            </form>
          </div>
        </div>

        {/* Footer info: Currently active zone & service availability */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Active Zone: <strong>{currentLocation.zone || "Central Lucknow Zone"}</strong>
            </span>
          </div>
          <span className="text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-full text-[11px]">
            ✓ 24x7 Coverage
          </span>
        </div>
      </div>
    </div>
  );
}
