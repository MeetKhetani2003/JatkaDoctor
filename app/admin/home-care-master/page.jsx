"use client";
import HomeCareServiceManager from "@/components/admin/HomeCareServiceManager";

export default function HomeCareMasterPage() {
  return (
    <HomeCareServiceManager
      category="home-care"
      title="Home Care Service Management"
      subtitle="Manage home care services, pricing, availability and display settings"
    />
  );
}
