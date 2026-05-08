import PartnerRegistrationForm from "@/components/PartnerRegistrationForm";

export const metadata = {
  title: "Clinic Partner | Dr Jhatka Medicare",
  description: "Join Dr Jhatka Medicare Network as a Clinic Partner.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <PartnerRegistrationForm title="Join as Clinic Partner" type="Clinic Partner" />
      </div>
    </div>
  );
}
