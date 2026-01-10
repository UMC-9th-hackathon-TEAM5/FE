import PlayerBadge from "@/components/Badge/playerBadge";

const players = [
  "          ",
  "사요",
  "서리",
  "구디",
  "이삭",
  "미로",
  "아진",
  "나호",
  "보리",
  "소방차",
  "",
];

export default function PlayerBadgeTestPage() {
  return (
    <div className="flex min-h-full flex-col gap-4 p-6">
      <h1 className="text-lg font-semibold text-white">PlayerBadge Test</h1>

      <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto py-2">
        {players.map((player) => (
          <PlayerBadge key={player} player={player} />
        ))}
      </div>
    </div>
  );
}
