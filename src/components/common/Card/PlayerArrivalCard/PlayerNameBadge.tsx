import React from "react";

interface PlayerNameBadgeProps {
  name: string;
  isHost?: boolean;
  isMe?: boolean;
}

export const PlayerNameBadge: React.FC<PlayerNameBadgeProps> = ({
  name,
  isHost,
  isMe,
}) => {
  const ariaLabel = `참여자 이름: ${name}${isHost ? " (방장)" : ""}${isMe ? " (나)" : ""}`;

  return (
    <div className="flex flex-col" aria-label={ariaLabel}>
      <div className="flex items-center gap-2 font-medium">
        <span className="text-sm text-white">{name}</span>
        {isHost && (
          <span className="text-main text-[10px]" aria-hidden="true">
            HOST
          </span>
        )}
        {isMe && (
          <span className="text-main text-[10px]" aria-hidden="true">
            ME
          </span>
        )}
      </div>
    </div>
  );
};
