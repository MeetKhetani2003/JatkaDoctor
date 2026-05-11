"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BookingForm from './BookingForm';
import { useBookingModal } from '@/context/BookingModalContext';

export default function BookingModal() {
  const { isOpen, closeModal, bookingData } = useBookingModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
              <BookingForm 
                defaultService={bookingData.service}
                defaultDoctor={bookingData.doctor}
                prefilledMessage={
                  bookingData.test ? `I want to book the ${bookingData.test} test.` : 
                  bookingData.package ? `I am interested in the ${bookingData.package} package.` : 
                  ""
                }
                onSuccess={() => {
                  // Optional: auto-close after success delay
                  setTimeout(closeModal, 3000);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
