"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientDashboardPage from "../dashboard/page";

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/patient/dashboard");
  }, [router]);

  return <PatientDashboardPage />;
}
