import PartyInfoCard, {
  PartyInfo,
} from "@/components/common/Card/PartyInfoCard";

const mockPartyInfo: PartyInfo = {
  date: "2026-01-11",
  location: "수지생태공원 분수대 앞",
  playTime: "60분",
  people: {
    police: 5,
    thief: 6,
  },
};

export default function PartyInfoCardTestPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <h1 className="mb-6 text-xl font-bold text-white">PartyInfoCard Test</h1>

      <section className="mb-12 w-full max-w-md">
        <h2 className="taext-white mb-4 text-lg font-semibold">Success Case</h2>
        <PartyInfoCard info={mockPartyInfo} />
      </section>

      <section className="w-full max-w-md">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Failure Case (No Props)
        </h2>
        <PartyInfoCard />
      </section>
    </div>
  );
}
