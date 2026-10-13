"use client";
import HomeCareServiceManager from "@/components/admin/HomeCareServiceManager";

export default function NursingCareMasterPage() {
  return (
    <HomeCareServiceManager
      category="nursing-care"
      title="Nursing Care Service Management"
      subtitle="Manage clinical nursing care services, pricing, nurse availability and care plans"
    />
  );
}
