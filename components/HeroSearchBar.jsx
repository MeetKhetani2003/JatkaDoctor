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
  ChevronRight,
  Mic
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

  // Voice Search (Speech Recognition) State
  const [isListening, setIsListening] = useState(false);
  const [hasFallbackResults, setHasFallbackResults] = useState(false);
  const recognitionRef = useRef(null);

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
      setHasFallbackResults(false);
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
          setHasFallbackResults(!!data.isFallback);
          setIsOpen(true);
        } else {
          setResults([]);
          setHasFallbackResults(false);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setHasFallbackResults(false);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Voice Search Handler
  const startVoiceSearch = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "hi-IN"; // Hindi / Indian English recognition
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          setIsOpen(true);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Voice search initiation error:", err);
      setIsListening(false);
    }
  };

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

  const getBadgeColor = (type, isRelated) => {
    if (isRelated) {
      return "bg-amber-50 text-amber-800 border-amber-300";
    }
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
              placeholder={isListening ? "Listening... बोलिए (बोलकर खोजें)" : "What do you need help with? (e.g. Ghutna dard, Ambulance, Doctor...)"}
              className={`w-full pl-11 pr-20 py-3.5 bg-gray-50/80 hover:bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-sm sm:text-base font-medium rounded-xl border transition-all outline-none ${
                isListening 
                  ? "border-red-500 ring-4 ring-red-500/20 bg-red-50/20" 
                  : "border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
              }`}
            />

            {/* Right Buttons: Clear Button + Voice Mic Option */}
            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setIsOpen(false);
                    inputRef.current?.focus();
                  }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Mic Option for Voice Search */}
              <button
                type="button"
                id="search-voice-mic-btn"
                onClick={startVoiceSearch}
                title={isListening ? "Listening... click to stop" : "Voice Search (बोलकर खोजें)"}
                className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30 scale-105"
                    : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
                }`}
              >
                <Mic className={`w-4 h-4 ${isListening ? "animate-bounce" : ""}`} />
              </button>
            </div>
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
                {/* Fallback Notice if exact match wasn't found */}
                {hasFallbackResults && (
                  <div className="px-4 py-2.5 bg-amber-50/80 border-b border-amber-100 text-amber-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>
                      Direct service for <strong>&ldquo;{query}&rdquo;</strong> not found. Showing <strong>Related Services</strong> you might need:
                    </span>
                  </div>
                )}
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{hasFallbackResults ? "Related Healthcare Services" : `Search Results (${results.length})`}</span>
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
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeColor(item.type, item.isRelated)}`}>
                            {item.isRelated ? "RELATED" : item.type?.toUpperCase()}
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
                  No matching services found
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Call our 24/7 care support directly for immediate assistance in Lucknow.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="tel:8874744756"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 transition"
                  >
                    Call +91 8874744756
                  </a>
                  <button
                    type="button"
                    onClick={() => router.push("/services")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Browse all services <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
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
