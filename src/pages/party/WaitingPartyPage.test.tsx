import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WaitingPartyPage from "./WaitingPartyPage";
import { getRoom } from "@/apis/room";
import { getParticipants, startGame } from "@/apis/roommember";

vi.mock("@/apis/room", () => ({
  getRoom: vi.fn(),
}));

vi.mock("@/apis/roommember", () => ({
  getParticipants: vi.fn(),
  startGame: vi.fn(),
  updateArrivalStatus: vi.fn(),
}));

const getRoomMock = vi.mocked(getRoom);
const getParticipantsMock = vi.mocked(getParticipants);
const startGameMock = vi.mocked(startGame);

describe("WaitingPartyPage", () => {
  beforeEach(() => {
    localStorage.clear();
    getRoomMock.mockReset();
    getParticipantsMock.mockReset();
    startGameMock.mockReset();
    localStorage.setItem("userId", "1");
    localStorage.setItem("hostId", "1");
    localStorage.setItem("roomId", "1");

    getRoomMock.mockResolvedValue({
      data: {
        roomId: 1,
        title: "테스트",
        placeName: "서울",
        meetingTime: "2026-01-11T10:23:00",
        status: "WAITING",
        countdownSeconds: 60,
        capacity: { current: 2, total: 4 },
        participants: [
          { userId: 1, nickname: "호스트", role: "POLICE", isArrived: true },
          { userId: 2, nickname: "참가자", role: "THIEF", isArrived: false },
        ],
      },
    } as any);

    getParticipantsMock.mockResolvedValue({
      data: {
        roomId: 1,
        participants: [
          { userId: 1, nickname: "호스트", role: "POLICE", isArrived: true },
          { userId: 2, nickname: "참가자", role: "THIEF", isArrived: false },
        ],
      },
    } as any);
  });

  it("shows the start button for the host", async () => {
    render(
      <MemoryRouter initialEntries={["/party/waiting?roomId=1"]}>
        <Routes>
          <Route path="/party/waiting" element={<WaitingPartyPage />} />
          <Route path="/home" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const startButton = await screen.findByRole("button", {
      name: "게임시작하기",
    });
    expect(startButton).toBeInTheDocument();
  });

  it("starts the game and navigates when the host clicks start", async () => {
    startGameMock.mockResolvedValue({
      data: {
        roomId: 1,
        stats: { totalPolice: 1, totalThieves: 1 },
        participants: [],
      },
    } as any);

    render(
      <MemoryRouter initialEntries={["/party/waiting?roomId=1"]}>
        <Routes>
          <Route path="/party/waiting" element={<WaitingPartyPage />} />
          <Route path="/game/start" element={<div>game-start</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const startButton = await screen.findByRole("button", {
      name: "게임시작하기",
    });
    const user = userEvent.setup();
    await user.click(startButton);

    expect(startGameMock).toHaveBeenCalled();
    expect(await screen.findByText("game-start")).toBeInTheDocument();
  });

  it("hides the start button for non-host users", async () => {
    localStorage.setItem("userId", "2");
    localStorage.setItem("hostId", "1");

    render(
      <MemoryRouter initialEntries={["/party/waiting?roomId=1"]}>
        <Routes>
          <Route path="/party/waiting" element={<WaitingPartyPage />} />
          <Route path="/home" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("대기방"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "게임시작하기" }),
    ).not.toBeInTheDocument();
  });
});
