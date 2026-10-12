"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { detectZone, LUCKNOW_ZONES } from "@/lib/zones";

const LocationContext = createContext(null);

const DEFAULT_LOCATION = {
  city: "Lucknow",
  area: "",
  pincode: "",
  formattedAddress: "Lucknow, Uttar Pradesh",
  zone: "Central Lucknow Zone",
  isServiceable: true,
  lat: 26.8467,
  lng: 80.9462,
  isCurrentLocation: false
};

// Common Lucknow pincodes mapping
export const LUCKNOW_PINCODES = {
  "226001": { area: "Hazratganj", zone: "Central Lucknow Zone" },
  "226003": { area: "Chowk", zone: "Central Lucknow Zone" },
  "226004": { area: "Charbagh", zone: "Central Lucknow Zone" },
  "226010": { area: "Gomti Nagar", zone: "Gomti Nagar Zone" },
  "226016": { area: "Indira Nagar", zone: "Indira Nagar Zone" },
  "226020": { area: "Aliganj", zone: "North / Outer Lucknow Zone" },
  "226021": { area: "Jankipuram", zone: "North / Outer Lucknow Zone" },
  "226005": { area: "Alambagh", zone: "Alambagh / Airport Zone" },
  "226012": { area: "Ashiyana", zone: "Alambagh / Airport Zone" },
  "226028": { area: "Chinhat", zone: "Indira Nagar Zone" },
  "226025": { area: "Telibagh", zone: "North / Outer Lucknow Zone" },
  "226002": { area: "Vrindavan Yojna", zone: "North / Outer Lucknow Zone" },
  "226017": { area: "Rajajipuram", zone: "North / Outer Lucknow Zone" }
};

export function LocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState("");

  // Load saved location on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dr_jhatka_user_location");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.city) {
          setCurrentLocation(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load saved location:", e);
    }
  }, []);

  // Save location updates to localStorage
  const updateLocation = (newLoc) => {
    const updated = { ...currentLocation, ...newLoc };
    setCurrentLocation(updated);
    try {
      localStorage.setItem("dr_jhatka_user_location", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save location to storage:", e);
    }
  };

  // 1. Detect via browser Geolocation (handles Allow & Deny)
  const requestCurrentLocation = async () => {
    setGeoLoading(true);
    setGeoError("");

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setGeoLoading(false);
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocode via OpenStreetMap Nominatim
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
              { headers: { 'Accept': 'application/json' } }
            );
            const data = await res.json();
            
            const addr = data.address || {};
            const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.road || "Central Lucknow";
            const city = addr.city || addr.town || addr.state_district || "Lucknow";
            const postcode = addr.postcode || "";
            const displayName = data.display_name || `${suburb}, ${city}`;

            const matchedZone = detectZone(displayName) || detectZone(suburb) || "Central Lucknow Zone";

            const newLocation = {
              city: city.includes("Lucknow") ? "Lucknow" : city,
              area: suburb,
              pincode: postcode,
              formattedAddress: displayName,
              zone: matchedZone,
              lat: latitude,
              lng: longitude,
              isServiceable: true,
              isCurrentLocation: true
            };

            updateLocation(newLocation);
            setGeoLoading(false);
            resolve({ success: true, location: newLocation });
          } catch (e) {
            // Geocode failed but coords succeeded
            const fallbackLoc = {
              city: "Lucknow",
              area: "Current Location",
              formattedAddress: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}, Lucknow`,
              zone: "Central Lucknow Zone",
              lat: latitude,
              lng: longitude,
              isServiceable: true,
              isCurrentLocation: true
            };
            updateLocation(fallbackLoc);
            setGeoLoading(false);
            resolve({ success: true, location: fallbackLoc });
          }
        },
        (error) => {
          // Graceful handling of denial or error
          let msg = "Unable to retrieve your location.";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "Location permission was denied. You can select your area or enter pincode manually.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = "Location information is unavailable. Please select your area manually.";
          } else if (error.code === error.TIMEOUT) {
            msg = "Location request timed out. Please select your area manually.";
          }
          setGeoError(msg);
          setGeoLoading(false);
          resolve({ success: false, error: msg });
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
      );
    });
  };

  // 2. Select Manual Area or Pincode
  const selectManualLocation = (areaName, pincode = "") => {
    const rawString = `${areaName} ${pincode} Lucknow`;
    const matchedZone = detectZone(rawString) || detectZone(areaName) || "Central Lucknow Zone";

    const newLocation = {
      city: "Lucknow",
      area: areaName,
      pincode: pincode,
      formattedAddress: `${areaName}${pincode ? ` (${pincode})` : ""}, Lucknow, Uttar Pradesh`,
      zone: matchedZone,
      isServiceable: true,
      isCurrentLocation: false
    };

    updateLocation(newLocation);
    setGeoError("");
    return newLocation;
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isModalOpen,
        setIsModalOpen,
        openLocationModal: () => setIsModalOpen(true),
        closeLocationModal: () => setIsModalOpen(false),
        geoLoading,
        geoError,
        setGeoError,
        requestCurrentLocation,
        selectManualLocation,
        updateLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
}
