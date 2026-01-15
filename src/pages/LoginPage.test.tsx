import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "@/pages/LoginPage";
import { postUser } from "@/apis/user";
import { createApiResponse } from "@/testUtils/apiResponse";

vi.mock("@/apis/user", () => ({
  postUser: vi.fn(),
}));

const postUserMock = vi.mocked(postUser);

describe("LoginPage", () => {
  it("enables the start button when inputs are valid", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    const startButton = screen.getByRole("button", { name: "START" });

    expect(startButton).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText(
        "닉네임 입력 (한글, 영문 공백 포함 최대 8자)",
      ),
      "테스트",
    );
    await user.type(
      screen.getByPlaceholderText("비밀번호 입력(4자리)"),
      "1234",
    );

    expect(startButton).toBeEnabled();
  });

  it("submits and navigates to home when login succeeds", async () => {
    postUserMock.mockResolvedValue(
      createApiResponse({
        userId: 1,
        nickname: "테스트",
        accessToken: "token",
        tokenType: "Bearer",
      }),
    );

    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) =>
          success({
            coords: {
              latitude: 37.5,
              longitude: 127.0,
            },
          } as GeolocationPosition),
      },
      configurable: true,
    });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<div>home</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const user = userEvent.setup();
    await user.type(
      screen.getByPlaceholderText(
        "닉네임 입력 (한글, 영문 공백 포함 최대 8자)",
      ),
      "테스트",
    );
    await user.type(
      screen.getByPlaceholderText("비밀번호 입력(4자리)"),
      "1234",
    );
    await user.click(screen.getByRole("button", { name: "START" }));

    expect(await screen.findByText("home")).toBeInTheDocument();
    expect(postUserMock).toHaveBeenCalledWith({
      nickname: "테스트",
      password: "1234",
      lat: 37.5,
      lng: 127.0,
    });
  });
});
