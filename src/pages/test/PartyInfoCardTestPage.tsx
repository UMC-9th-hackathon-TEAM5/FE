import PartyInfoCard from "@/components/common/Card/PartyInfoCard";

export default function PartyInfoCardTestPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-xl font-bold text-white">PartyInfoCard Test</h1>

      <PartyInfoCard />
    </div>
  );
}
