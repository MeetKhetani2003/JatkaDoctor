import PartnerRegistrationForm from "@/components/PartnerRegistrationForm";

export const metadata = {
  title: "Physiotherapist Registration | Dr Jhatka Medicare",
  description: "Join Dr Jhatka Medicare Network as a Physiotherapist.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <PartnerRegistrationForm title="Join as Physiotherapist" type="Physiotherapist" />
      </div>
    </div>
  );
}
