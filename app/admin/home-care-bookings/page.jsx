"use client";
import HomeCareBookingManager from "@/components/admin/HomeCareBookingManager";

export default function HomeCareBookingsPage() {
  return (
    <HomeCareBookingManager
      category="home-care"
      title="Home Care Bookings & Requests"
      subtitle="Manage patient attendant, caregiver, elderly care and home recovery bookings"
    />
  );
}
