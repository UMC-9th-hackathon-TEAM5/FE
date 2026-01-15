import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GameStartPage from "./GameStartPage";
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

describe("GameStartPage", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userId", "1");
    localStorage.setItem("hostId", "1");
    getRoomMock.mockReset();
    getParticipantsMock.mockReset();
    getParticipantsMock.mockResolvedValue(
      createApiResponse({
        roomId: 1,
        participants: [
          {
            userId: 1,
            nickname: "호스트",
            role: "POLICE",
            isArrived: true,
          },
        ],
      }),
    );
  });

  it("renders the host start button", () => {
    render(
      <MemoryRouter initialEntries={["/game/start?roomId=1"]}>
        <GameStartPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: "게임 시작하기" }),
    ).toBeInTheDocument();
  });

  it("starts the countdown after clicking the start button", async () => {
    getRoomMock.mockResolvedValue(
      createApiResponse({
        roomId: 1,
        title: "테스트",
        placeName: "서울",
        meetingTime: "2026-01-11T10:23:00",
        status: "WAITING",
        countdownSeconds: 60,
        escapeTime: 300,
        capacity: { current: 2, total: 4 },
        participants: [],
      }),
    );

    render(
      <MemoryRouter initialEntries={["/game/start?roomId=1"]}>
        <GameStartPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "게임 시작하기" }));

    expect(getRoomMock).toHaveBeenCalledWith(1);
    expect(localStorage.getItem("gameSeconds")).toBe("300");
  });
});
