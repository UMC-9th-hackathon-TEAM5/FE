import { test, expect } from "@playwright/test";

const roomDetailData = {
  roomId: 1,
  title: "테스트",
  placeName: "서울특별시 강남구",
  meetingTime: "2026-01-11T10:23:00",
  status: "WAITING",
  countdownSeconds: 60,
  escapeTime: 300,
  police_capacity: 2,
  thief_capacity: 2,
  capacity: { current: 2, total: 4 },
  participants: [
    { userId: 1, nickname: "호스트", role: "POLICE", isArrived: true },
    { userId: 2, nickname: "참가자", role: "THIEF", isArrived: false },
  ],
};

const participantsData = {
  roomId: 1,
  participants: [
    {
      userId: 1,
      nickname: "호스트",
      role: "POLICE",
      isArrived: true,
      isAlive: "ALIVE",
      caughtCount: 1,
    },
    {
      userId: 2,
      nickname: "참가자",
      role: "THIEF",
      isArrived: true,
      isAlive: "CAUGHT",
    },
  ],
};

const apiResponse = (data: unknown, path: string) => ({
  timestamp: "2026-01-11T10:23:00",
  status: 200,
  code: "SUCCESS",
  message: "OK",
  path,
  data,
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("userId", "1");
    localStorage.setItem("hostId", "1");
    localStorage.setItem("roomId", "1");
    localStorage.setItem("nickname", "테스터");
    localStorage.setItem("gameResultWinningTeam", "POLICE");
  });

  await page.route("**/api/v1/rooms/nearby", (route) =>
    route.fulfill({
      json: apiResponse({ rooms: [], totalCount: 0 }, "/api/v1/rooms/nearby"),
    }),
  );
  await page.route("**/api/v1/rooms/1", (route) =>
    route.fulfill({
      json: apiResponse(roomDetailData, "/api/v1/rooms/1"),
    }),
  );
  await page.route("**/api/v1/rooms/1/participants", (route) =>
    route.fulfill({
      json: apiResponse(participantsData, "/api/v1/rooms/1/participants"),
    }),
  );
});

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("경도팟")).toBeVisible();
});

test("home page loads", async ({ page }) => {
  await page.goto("/home");
  await expect(
    page.getByRole("button", { name: "+ 새로운 경도팟 만들기" }),
  ).toBeVisible();
});

test("party detail page loads", async ({ page }) => {
  await page.goto("/party/detail?roomId=1");
  await expect(page.getByText("팟 상세")).toBeVisible();
  await expect(page.getByText("경찰 2명 / 도둑 2명")).toBeVisible();
});

test("party create page loads", async ({ page }) => {
  await page.goto("/party/create");
  await expect(page.getByText("팟 만들기")).toBeVisible();
});

test("waiting page loads", async ({ page }) => {
  await page.goto("/party/waiting?roomId=1");
  await expect(page.getByText("대기방")).toBeVisible();
});

test("game start page loads", async ({ page }) => {
  await page.goto("/game/start?roomId=1");
  await expect(page.getByText("시작 전 체크리스트")).toBeVisible();
});

test("game play page loads", async ({ page }) => {
  await page.goto("/game/playing");
  await expect(page.getByText("남은 시간")).toBeVisible();
});

test("game result page loads", async ({ page }) => {
  await page.goto("/game/result?roomId=1");
  await expect(page.getByText("경찰팀 승리!")).toBeVisible();
});
