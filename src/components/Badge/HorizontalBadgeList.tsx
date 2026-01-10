import clsx from "clsx";
import PlayerBadge from "./playerBadge";

interface HorizontalBadgeListProps {
  items: string[];
  className?: string;
}

export default function HorizontalBadgeList({
  items,
  className = "",
}: HorizontalBadgeListProps) {
  return (
    <div
      role="listitem"
      className={clsx(
        "scrollbar-hide flex items-center gap-3 overflow-x-auto py-2",
        className,
      )}
    >
      {items.map((item, index) => (
        <PlayerBadge key={`${item}-${index}`} player={item} />
      ))}
    </div>
  );
}
