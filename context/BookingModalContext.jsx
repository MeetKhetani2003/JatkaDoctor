"use client";
import React, { createContext, useContext, useState } from 'react';

const BookingModalContext = createContext();

export function BookingModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAmbulanceOpen, setIsAmbulanceOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: "",
    package: "",
    doctor: "",
    test: ""
  });

  const openModal = (data = {}) => {
    setBookingData({
      service: data.service || "",
      package: data.package || "",
      doctor: data.doctor || "",
      test: data.test || ""
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const openAmbulanceModal = () => setIsAmbulanceOpen(true);
  const closeAmbulanceModal = () => setIsAmbulanceOpen(false);

  return (
    <BookingModalContext.Provider value={{ 
      isOpen, openModal, closeModal, bookingData,
      isAmbulanceOpen, openAmbulanceModal, closeAmbulanceModal 
    }}>
      {children}
    </BookingModalContext.Provider>
  );
}

export const useBookingModal = () => {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error('useBookingModal must be used within a BookingModalProvider');
  }
  return context;
};
