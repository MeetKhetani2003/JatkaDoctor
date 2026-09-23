"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const PatientAuthContext = createContext(null);

export function PatientAuthProvider({ children }) {
  const [patient, setPatient] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/patient-session");
      const data = await res.json();
      setLoggedIn(data.loggedIn);
      setPatient(data.patient || null);
      setProfileComplete(data.patient?.profileComplete || false);
    } catch {
      setLoggedIn(false);
      setPatient(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/patient-session", { method: "DELETE" });
    setLoggedIn(false);
    setPatient(null);
    setProfileComplete(false);
  }, []);

  return (
    <PatientAuthContext.Provider value={{ patient, loggedIn, profileComplete, loading, logout, refresh }}>
      {children}
    </PatientAuthContext.Provider>
  );
}

export function usePatientAuth() {
  const ctx = useContext(PatientAuthContext);
  if (!ctx) throw new Error("usePatientAuth must be used within PatientAuthProvider");
  return ctx;
}
