import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GamePlayPage from "./GamePlayPage";
import { getParticipants } from "@/apis/roommember";
import { createApiResponse } from "@/testUtils/apiResponse";

vi.mock("@/apis/roommember", () => ({
  getParticipants: vi.fn(),
  captureThief: vi.fn(),
  releaseThief: vi.fn(),
}));

vi.mock("@/apis/room", () => ({
  postFinishgame: vi.fn(),
}));

const getParticipantsMock = vi.mocked(getParticipants);

describe("GamePlayPage", () => {
  beforeEach(() => {
    localStorage.clear();
    getParticipantsMock.mockReset();
    localStorage.setItem("roomId", "1");
    localStorage.setItem("userId", "1");
    localStorage.setItem("hostId", "1");
    localStorage.setItem("gameSeconds", "0");

    getParticipantsMock.mockResolvedValue(
      createApiResponse({
        roomId: 1,
        participants: [
          {
            userId: 1,
            nickname: "호스트",
            role: "POLICE",
            isArrived: true,
            isAlive: "ALIVE",
          },
          {
            userId: 2,
            nickname: "도둑",
            role: "THIEF",
            isArrived: true,
            isAlive: "ALIVE",
          },
        ],
      }),
    );
  });

  it("renders the timer label", async () => {
    render(
      <MemoryRouter>
        <GamePlayPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("남은 시간")).toBeInTheDocument();
  });

  it("opens the end confirmation modal", async () => {
    render(
      <MemoryRouter>
        <GamePlayPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const endButton = await screen.findByRole("button", {
      name: "게임 종료하기",
    });
    await user.click(endButton);

    expect(
      await screen.findByText("게임이 진행 중입니다."),
    ).toBeInTheDocument();
  });
});
