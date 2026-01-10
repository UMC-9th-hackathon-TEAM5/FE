import HorizontalBadgeList from "@/components/Badge/HorizontalBadgeList";

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

      <HorizontalBadgeList items={players} />
    </div>
  );
}
