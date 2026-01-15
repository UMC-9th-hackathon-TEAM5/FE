import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreatePartyPage from "@/pages/party/CreatePartyPage";
import { postRoom } from "@/apis/room";
import { createApiResponse } from "@/testUtils/apiResponse";

vi.mock("@/apis/room", () => ({
  postRoom: vi.fn(),
}));

const postRoomMock = vi.mocked(postRoom);

describe("CreatePartyPage", () => {
  beforeEach(() => {
    postRoomMock.mockReset();
  });

  it("renders the create party form", () => {
    render(
      <MemoryRouter>
        <CreatePartyPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("팟 만들기")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "팟 생성하기" }),
    ).toBeInTheDocument();
  });

  it("submits when the form is valid", async () => {
    postRoomMock.mockResolvedValue(
      createApiResponse({ roomId: 1, hostId: 1 }),
    );

    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) =>
          success({
            coords: { latitude: 37.5, longitude: 127.0 },
          } as GeolocationPosition),
      },
      configurable: true,
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/party/create"]}>
        <Routes>
          <Route path="/party/create" element={<CreatePartyPage />} />
          <Route path="/party/waiting" element={<div>waiting</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.type(
      screen.getByPlaceholderText("예 : 수지구 경도팟 모임"),
      "테스트 파티",
    );
    await user.type(
      screen.getByPlaceholderText("예 : 수지생태공원 분수대 앞"),
      "서울",
    );
    await user.type(
      screen.getByPlaceholderText("경도팟에 대한 설명을 적어주세요"),
      "설명",
    );

    const dateInput = container.querySelector(
      'input[type="datetime-local"]',
    ) as HTMLInputElement;
    fireEvent.change(dateInput, {
      target: { value: "2099-01-11T10:23" },
    });

    const numberInputs = Array.from(
      container.querySelectorAll('input[type="number"]'),
    ) as HTMLInputElement[];
    fireEvent.change(numberInputs[0], { target: { value: "1" } });
    fireEvent.change(numberInputs[1], { target: { value: "1" } });
    fireEvent.change(numberInputs[2], { target: { value: "30" } });
    fireEvent.change(numberInputs[3], { target: { value: "60" } });

    await user.click(screen.getByRole("button", { name: "팟 생성하기" }));

    expect(postRoomMock).toHaveBeenCalled();
    expect(await screen.findByText("waiting")).toBeInTheDocument();
  });
});
