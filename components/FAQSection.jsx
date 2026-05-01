"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ title = "Frequently Asked Questions", faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-5 py-12 max-w-4xl mx-auto w-full">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 text-center">{title}</h3>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-100 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left focus:outline-none"
            >
              <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{faq.q}</span>
              <div className={`w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>
                <ChevronDown className="w-4 h-4 text-primary" />
              </div>
            </button>
            <div 
              className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-50 pt-3">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
