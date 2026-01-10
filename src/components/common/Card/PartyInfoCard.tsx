import BaseCard from "./BaseCard";

export interface PartyInfo {
  date: string;
  location: string;
  playTime: string;
  people: {
    police: number;
    thief: number;
  };
}

interface PartyInfoCardProps {
  info: PartyInfo;
  className?: string;
}

export function PartyInfoCard({ info, className }: PartyInfoCardProps) {
  const items = [
    { label: "일시", value: info.date },
    { label: "장소", value: info.location },
    { label: "플레이", value: info.playTime },
    {
      label: "인원",
      value: `경찰 ${info.people.police}명 / 도둑 ${info.people.thief}명`,
    },
  ];

  return (
    <section className="bg-main-dark2 flex h-fit w-77.5 flex-col gap-5 px-3 py-4">
      <div className="flex gap-2 text-sm font-medium">
        <span className="text-main-variant">일시</span>
        <span className="text-white">2026. 01. 10 (토) 20:00~</span>
      </div>
      <div className="flex gap-2 text-sm font-medium">
        <span className="text-main-variant">장소</span>
        <span className="text-white">수지생태공원 분수대 앞</span>
      </div>
      <div className="flex gap-2 text-sm font-medium">
        <span className="text-main-variant">재집결</span>
        <span className="text-white">수지생태공원 벤치</span>
      </div>
      <div className="flex gap-2 text-sm font-medium">
        <span className="text-main-variant">플레이</span>
        <span className="text-white">60분</span>
      </div>
      <div className="flex gap-2 text-sm font-medium">
        <span className="text-main-variant">인원</span>
        <span className="text-white">경찰 5명 / 도둑 5명</span>
      </div>
    </section>
  );
}

export default PartyInfoCard;
