import PartnerRegistrationForm from "@/components/PartnerRegistrationForm";

export const metadata = {
  title: "Partner Registration | Dr Jhatka Medicare",
  description: "Join Dr Jhatka Medicare Network as a Home Care Partner.",
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <PartnerRegistrationForm title="Partner Registration" type="Home Care Partner" />
      </div>
    </div>
  );
}
