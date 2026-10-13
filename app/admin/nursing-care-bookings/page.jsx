"use client";
import HomeCareBookingManager from "@/components/admin/HomeCareBookingManager";

export default function NursingCareBookingsPage() {
  return (
    <HomeCareBookingManager
      category="nursing-care"
      title="Nursing Care Bookings & Requests"
      subtitle="Manage clinical nursing bookings, nurse assignments, care plans and visits"
    />
  );
}
