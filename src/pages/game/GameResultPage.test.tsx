import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GameResultPage from "./GameResultPage";
import { getRoom } from "@/apis/room";
import { getParticipants } from "@/apis/roommember";
import { createApiResponse } from "@/testUtils/apiResponse";

vi.mock("@/apis/room", () => ({
  getRoom: vi.fn(),
}));

vi.mock("@/apis/roommember", () => ({
  getParticipants: vi.fn(),
}));

const getRoomMock = vi.mocked(getRoom);
const getParticipantsMock = vi.mocked(getParticipants);

describe("GameResultPage", () => {
  beforeEach(() => {
    localStorage.clear();
    getRoomMock.mockReset();
    getParticipantsMock.mockReset();
    localStorage.setItem("roomId", "1");
    localStorage.setItem("userId", "1");
    localStorage.setItem("hostId", "1");

    getRoomMock.mockResolvedValue(
      createApiResponse({
        roomId: 1,
        title: "테스트",
        placeName: "서울",
        meetingTime: "2026-01-11T10:23:00",
        status: "FINISHED",
        countdownSeconds: 60,
        escapeTime: 300,
        capacity: { current: 2, total: 4 },
        participants: [],
      }),
    );

    getParticipantsMock.mockResolvedValue(
      createApiResponse({
        roomId: 1,
        participants: [
          {
            userId: 1,
            nickname: "경찰",
            role: "POLICE",
            isArrived: true,
            isAlive: "ALIVE",
            caughtCount: 1,
          },
          {
            userId: 2,
            nickname: "도둑",
            role: "THIEF",
            isArrived: true,
            isAlive: "CAUGHT",
          },
        ],
      }),
    );
  });

  it("shows the police victory title when all thieves are caught", async () => {
    render(
      <MemoryRouter initialEntries={["/game/result?roomId=1"]}>
        <GameResultPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("경찰팀 승리!"),
    ).toBeInTheDocument();
  });
});
