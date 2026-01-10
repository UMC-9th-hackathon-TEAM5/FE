interface playerBadgeProps {
  player?: string;
}

export default function PlayerBadge({ player }: playerBadgeProps) {
  return (
    <div className="bg-main-dark1 flex h-7 min-w-fit items-center justify-center rounded-lg p-2 text-sm font-medium text-white">
      {player?.trim() ? player : "Unknown"}
    </div>
  );
}
