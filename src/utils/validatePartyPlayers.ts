export type PlayerRole = "police" | "thief";

export interface Player {
  name: string;
  role: PlayerRole;
  arrivalStatus: "arrived" | "notArrived";
  isHost?: boolean;
  isMe?: boolean;
}

export type ValidationResult =
  | {
      isValid: true;
    }
  | {
      isValid: false;
      message: string;
    };

export function validatePlayers(players: Player[]): ValidationResult {
  const policeCount = players.filter(
    (player) => player.role === "police",
  ).length;

  const thiefCount = players.filter((player) => player.role === "thief").length;

  if (policeCount < 1) {
    return {
      isValid: false,
      message: "경찰은 최소 1명 이상 있어야 합니다.",
    };
  }

  if (thiefCount < 1) {
    return {
      isValid: false,
      message: "도둑은 최소 1명 이상 있어야 합니다.",
    };
  }

  if (policeCount > thiefCount * 2) {
    return {
      isValid: false,
      message: "경찰 인원은 도둑 인원의 2배를 초과할 수 없습니다.",
    };
  }

  return { isValid: true };
}
