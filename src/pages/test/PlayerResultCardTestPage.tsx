import PlayerResultCard from "@/components/common/Card/PlayerResultCard/PlayerResultCard";

const mockResults = [
  {
    id: "1",
    name: "사요",
    role: "thief" as const,
    result: "survived" as const,
    isHost: true,
  },
  {
    id: "2",
    name: "서리",
    role: "thief" as const,
    result: "jailed" as const,
  },
  {
    id: "3",
    name: "구디",
    role: "police" as const,
    catchCount: 3,
  },
  {
    id: "4",
    name: "이삭",
    role: "police" as const,
    catchCount: 1,
    isMe: true,
  },
];

const PlayerResultCardTestPage = () => {
  return (
    <main
      className="flex min-h-screen flex-col items-center gap-4 bg-black p-6"
      role="main"
      aria-label="게임 종료 결과 테스트 페이지"
    >
      <h1 className="mb-4 text-lg font-semibold text-white">
        게임 종료 결과 카드 테스트
      </h1>

      <ul className="flex flex-col gap-3">
        {mockResults.map((player) => (
          <PlayerResultCard key={player.id} {...player} />
        ))}
      </ul>
    </main>
  );
};

export default PlayerResultCardTestPage;
