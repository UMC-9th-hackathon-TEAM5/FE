import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/pages/HomePage";
import { getNearbyRoom } from "@/apis/room";

vi.mock("@/apis/room", () => ({
  getNearbyRoom: vi.fn(),
  getRoom: vi.fn(),
  postRoom: vi.fn(),
}));

vi.mock("@/apis/roommember", () => ({
  joinRoom: vi.fn(),
}));

const getNearbyRoomMock = vi.mocked(getNearbyRoom);

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    getNearbyRoomMock.mockReset();
    localStorage.setItem("userId", "1");
    localStorage.setItem("nickname", "테스터");
    getNearbyRoomMock.mockResolvedValue({
      data: { rooms: [], totalCount: 0 },
    } as any);
  });

  it("renders action buttons", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole("button", { name: "+ 새로운 경도팟 만들기" }),
    ).toBeInTheDocument();
  });

  it("navigates to create page when clicking the create button", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/party/create" element={<div>create</div>} />
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.click(
      await screen.findByRole("button", { name: "+ 새로운 경도팟 만들기" }),
    );

    expect(await screen.findByText("create")).toBeInTheDocument();
  });
});
