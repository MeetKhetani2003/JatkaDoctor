import PartnerRegistrationForm from "@/components/PartnerRegistrationForm";

export const metadata = {
  title: "Hospital Partner | Dr Jhatka Medicare",
  description: "Join Dr Jhatka Medicare Network as a Hospital Partner.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <PartnerRegistrationForm title="Join as Hospital Partner" type="Hospital Partner" />
      </div>
    </div>
  );
}
