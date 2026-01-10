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
<<<<<<< HEAD
<<<<<<< HEAD
      role="listitem"
=======
>>>>>>> 5a70782 (feat:HorizontalPlayBadgeList 컴포넌트 구현)
=======
      role="listitem"
>>>>>>> ec2f194 (chore:role 속성 보완)
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
