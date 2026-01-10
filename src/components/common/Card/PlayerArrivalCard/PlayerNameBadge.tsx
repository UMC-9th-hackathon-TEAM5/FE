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
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <span>{name}</span>
        {isHost && (
          <span className="rounded bg-yellow-300 px-2 py-0.5 text-xs font-medium text-yellow-900 select-none">
            호스트
          </span>
        )}
        {isMe && (
          <span className="rounded bg-indigo-300 px-2 py-0.5 text-xs font-medium text-indigo-900 select-none">
            나
          </span>
        )}
      </div>
    </div>
  );
};
