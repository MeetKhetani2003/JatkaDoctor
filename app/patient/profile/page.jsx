"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PatientDashboardPage from "../dashboard/page";

function ProfileRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      router.replace(`/patient/dashboard?tab=${tab}`);
    } else {
      router.replace("/patient/dashboard");
    }
  }, [router, searchParams]);

  return <PatientDashboardPage />;
}

export default function ProfileRedirectPage() {
  return (
    <Suspense fallback={null}>
      <ProfileRedirectContent />
    </Suspense>
  );
}
