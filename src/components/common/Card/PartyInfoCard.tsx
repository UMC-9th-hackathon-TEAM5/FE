<<<<<<< HEAD
<<<<<<< HEAD
import BaseCard from "./BaseCard";

export interface PartyInfo {
  date: string;
  location: string;
=======
export interface PartyInfo {
  date: string;
  location: string;
  regroup: string;
>>>>>>> 39d70da (feat:PartyInfoCard 일부 구현)
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

<<<<<<< HEAD
export function PartyInfoCard({ info, className }: PartyInfoCardProps) {
  const items = [
    { label: "일시", value: info.date },
    { label: "장소", value: info.location },
=======
export function PartyInfoCard({ info, className = "" }: PartyInfoCardProps) {
  const items = [
    { label: "일시", value: info.date },
    { label: "장소", value: info.location },
    { label: "재집결", value: info.regroup },
>>>>>>> 39d70da (feat:PartyInfoCard 일부 구현)
    { label: "플레이", value: info.playTime },
    {
      label: "인원",
      value: `경찰 ${info.people.police}명 / 도둑 ${info.people.thief}명`,
    },
  ];

<<<<<<< HEAD
  return (
    <BaseCard className={className}>
      {items.map(({ label, value }) => (
        <div key={label} className="flex gap-2 text-sm font-medium">
          <span className="text-main-variant">{label}</span>
          <span className="text-white">{value}</span>
        </div>
      ))}
    </BaseCard>
  );
}

interface PartyInfoCardWrapperProps {
  info?: PartyInfo;
  className?: string;
}

export default function PartyInfoCardWrapper(props: PartyInfoCardWrapperProps) {
  if (!props.info) {
    return (
      <BaseCard className={props.className}>
        <div className="text-center text-sm font-medium text-white">
          파티 정보를 불러올 수 없습니다
        </div>
      </BaseCard>
    );
  }
  return <PartyInfoCard info={props.info} className={props.className} />;
}
=======
const PartyInfoCard = () => {
=======
>>>>>>> 39d70da (feat:PartyInfoCard 일부 구현)
  return (
    <section
      className={`bg-main-dark2 flex h-fit w-77.5 flex-col gap-5 px-3 py-4 ${className}`}
    >
      {items.map(({ label, value }, index) => (
        <div key={index} className="flex gap-2 text-sm font-medium">
          <span className="text-main-variant">{label}</span>
          <span className="text-white">{value}</span>
        </div>
      ))}
    </section>
  );
}

<<<<<<< HEAD
export default PartyInfoCard;
>>>>>>> 2d49d38 (feat:PartyInfoCard 컴포넌트 일부 구현)
=======
export default function PartyInfoCardWrapper(
  props: Partial<PartyInfoCardProps>,
) {
  if (!props.info) {
    return (
      <section
        className={`bg-main-dark2 flex h-fit w-77.5 flex-col gap-5 px-3 py-4 ${props.className ?? ""}`}
      >
        <div className="text-center text-sm font-medium text-white">
          파티 정보를 불러올 수 없습니다
        </div>
      </section>
    );
  }
  return <PartyInfoCard info={props.info} className={props.className} />;
}
>>>>>>> 39d70da (feat:PartyInfoCard 일부 구현)
