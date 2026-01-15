import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PartyDetailPage from "./PartyDetailPage";
import { getRoom } from "@/apis/room";
import { getParticipants, joinRoom } from "@/apis/roommember";

vi.mock("@/apis/room", () => ({
  getRoom: vi.fn(),
}));

vi.mock("@/apis/roommember", () => ({
  getParticipants: vi.fn(),
  joinRoom: vi.fn(),
}));

const getRoomMock = vi.mocked(getRoom);
const getParticipantsMock = vi.mocked(getParticipants);
const joinRoomMock = vi.mocked(joinRoom);

describe("PartyDetailPage", () => {
  beforeEach(() => {
    getRoomMock.mockReset();
    getParticipantsMock.mockReset();
    joinRoomMock.mockReset();
    localStorage.clear();
    localStorage.setItem("userId", "1");
  });

  it("shows police/thief capacity when provided by room detail", async () => {
    getRoomMock.mockResolvedValue({
      data: {
        roomId: 52,
        title: "테스트",
        placeName: "서울특별시 강남구",
        meetingTime: "2026-01-11T10:23:00",
        status: "WAITING",
        countdownSeconds: 60,
        police_capacity: 3,
        thief_capacity: 5,
        capacity: { current: 2, total: 8 },
        participants: [],
      },
    } as any);

    getParticipantsMock.mockResolvedValue({
      data: {
        roomId: 52,
        participants: [],
      },
    } as any);

    render(
      <MemoryRouter initialEntries={["/party/detail?roomId=52"]}>
        <PartyDetailPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText("경찰 3명 / 도둑 5명"),
    ).toBeInTheDocument();
  });

  it("joins the room after selecting a role", async () => {
    getRoomMock.mockResolvedValue({
      data: {
        roomId: 1,
        title: "테스트",
        placeName: "서울",
        meetingTime: "2026-01-11T10:23:00",
        status: "WAITING",
        countdownSeconds: 60,
        police_capacity: 1,
        thief_capacity: 1,
        capacity: { current: 1, total: 2 },
        participants: [{ userId: 1, nickname: "호스트", role: "POLICE" }],
      },
    } as any);

    getParticipantsMock.mockResolvedValue({
      data: {
        roomId: 1,
        participants: [{ userId: 1, nickname: "호스트", role: "POLICE" }],
      },
    } as any);

    joinRoomMock.mockResolvedValue({
      data: {
        roomId: 1,
        userId: 1,
        rolePreference: "POLICE",
        message: "ok",
      },
    } as any);

    render(
      <MemoryRouter initialEntries={["/party/detail?roomId=1"]}>
        <Routes>
          <Route path="/party/detail" element={<PartyDetailPage />} />
          <Route path="/party/waiting" element={<div>waiting</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: /경찰/ }),
    );
    await user.click(
      screen.getByRole("button", { name: "참여 신청하기" }),
    );

    expect(joinRoomMock).toHaveBeenCalledWith(1, { rolePreference: "POLICE" });
    expect(await screen.findByText("waiting")).toBeInTheDocument();
  });
});
