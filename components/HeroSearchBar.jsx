"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  X, 
  Loader2, 
  FileText, 
  ArrowRight, 
  Activity, 
  Ambulance, 
  Stethoscope, 
  HeartPulse, 
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function HeroSearchBar({ onOpenPrescriptionModal }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Quick suggestion chips
  const suggestions = [
    { label: "Knee Pain", query: "Knee Pain" },
    { label: "Ambulance", query: "Ambulance" },
    { label: "Doctor Visit", query: "Doctor" },
    { label: "Physiotherapy", query: "Physiotherapy" },
    { label: "Back Pain", query: "Back Pain" },
    { label: "ICU at Home", query: "ICU" }
  ];

  // Fetch search results from API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
          setIsOpen(true);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    setIsOpen(false);
    setQuery("");
    if (item.url) {
      router.push(item.url);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "condition":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "department":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "service":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "package":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <section className="relative z-30 max-w-5xl mx-auto px-4 -mt-3 sm:-mt-6 mb-8">
      <div 
        ref={dropdownRef}
        className="bg-white rounded-2xl shadow-xl shadow-emerald-950/5 border border-emerald-100 p-3 sm:p-4 backdrop-blur-md transition-all"
      >
        {/* Search Input Bar + Quick Prescription Action */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 sm:gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              id="hero-search-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(-1);
              }}
              onFocus={() => {
                if (query.trim() && results.length > 0) setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="What do you need help with? (e.g. Knee Pain, Ambulance, Doctor...)"
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base font-medium rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 outline-none transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Action: Upload Prescription Button */}
          <button
            type="button"
            id="quick-upload-prescription-btn"
            onClick={onOpenPrescriptionModal}
            className="flex items-center justify-center gap-2.5 px-4 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-white/20 text-white">
              <FileText className="w-3.5 h-3.5" />
            </span>
            <span>Upload Prescription</span>
            <span className="hidden sm:inline text-[11px] font-normal uppercase tracking-wider bg-emerald-800/40 px-2 py-0.5 rounded-full border border-emerald-400/30">
              Quick Care
            </span>
          </button>
        </div>

        {/* Live Search Results Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[420px] overflow-y-auto divide-y divide-gray-100">
            {results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Search Results ({results.length})</span>
                  <span className="text-[11px] font-normal lowercase text-gray-400">click to open service / booking</span>
                </div>
                {results.map((item, index) => {
                  const isSelected = index === activeIndex;
                  return (
                    <div
                      key={item.id || index}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                        isSelected ? "bg-emerald-50/80" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {item.title}
                          </h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor(item.type)}`}>
                            {item.type?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium truncate flex items-center gap-1">
                          {item.subtitle}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? "text-emerald-600 translate-x-1" : "text-gray-300"}`} />
                    </div>
                  );
                })}
              </div>
            ) : !loading && query.trim() ? (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  No matching services or conditions found
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Try searching for Knee Pain, Ambulance, Doctor, or ICU
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/services")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Browse all medical services <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100/80 overflow-x-auto no-scrollbar text-xs">
          <span className="text-gray-400 font-medium flex items-center gap-1 whitespace-nowrap pl-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(s.query);
                inputRef.current?.focus();
              }}
              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 font-medium text-xs whitespace-nowrap transition-colors border border-transparent hover:border-emerald-200"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
