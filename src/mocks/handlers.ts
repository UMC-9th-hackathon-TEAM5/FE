import { http, HttpResponse } from "msw";
import type { ParticipantInfo, Role, RoomStatus } from "@/apis/types";

const formatLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
};

type MockRoom = {
  roomId: number;
  title: string;
  description?: string;
  placeName: string;
  lat: number;
  lng: number;
  meetingTime: string;
  status: RoomStatus;
  countdownSeconds: number;
  escapeTime: number;
  police_capacity: number;
  thief_capacity: number;
};

type SessionUser = {
  userId: number;
  nickname: string;
};

type ParticipantsStore = Record<number, ParticipantInfo[]>;

const now = new Date();
const futureMeetingTime = formatLocalDateTime(
  new Date(now.getTime() + 60 * 60 * 1000),
);
const pastMeetingTime = formatLocalDateTime(
  new Date(now.getTime() - 60 * 60 * 1000),
);

const mockState: {
  currentUser: SessionUser | null;
  nextUserId: number;
  nextRoomId: number;
  rooms: MockRoom[];
  participantsByRoomId: ParticipantsStore;
} = {
  currentUser: { userId: 1, nickname: "Tester" },
  nextUserId: 5,
  nextRoomId: 103,
  rooms: [
    {
      roomId: 101,
      title: "River Run",
      description: "Mock description for River Run.",
      placeName: "Seoul Yeongdeungpo-gu",
      lat: 37.5207,
      lng: 126.9739,
      meetingTime: futureMeetingTime,
      status: "WAITING",
      countdownSeconds: 10,
      escapeTime: 30 * 60,
      police_capacity: 2,
      thief_capacity: 2,
    },
    {
      roomId: 102,
      title: "Past Room",
      description: "Mock description for Past Room.",
      placeName: "Seoul Gangnam-gu",
      lat: 37.4981,
      lng: 127.0276,
      meetingTime: pastMeetingTime,
      status: "FINISHED",
      countdownSeconds: 10,
      escapeTime: 30 * 60,
      police_capacity: 2,
      thief_capacity: 2,
    },
  ],
  participantsByRoomId: {
    101: [
      {
        userId: 1,
        nickname: "Tester",
        role: "POLICE",
        isArrived: false,
        isAlive: "ALIVE",
        caughtCount: 0,
      },
      {
        userId: 2,
        nickname: "Sample",
        role: "THIEF",
        isArrived: true,
        isAlive: "ALIVE",
        caughtCount: 0,
      },
    ],
    102: [
      {
        userId: 3,
        nickname: "PastUser",
        role: "THIEF",
        isArrived: true,
        isAlive: "CAUGHT",
        caughtCount: 0,
      },
    ],
  },
};

const jsonResponse = <T>(request: Request, data: T, status = 200) =>
  HttpResponse.json(
    {
      timestamp: new Date().toISOString(),
      status,
      code: status >= 200 && status < 300 ? "SUCCESS" : "ERROR",
      message: status >= 200 && status < 300 ? "ok" : "error",
      path: new URL(request.url).pathname,
      data,
    },
    { status },
  );

const getRoomById = (roomId: number) =>
  mockState.rooms.find((room) => room.roomId === roomId) ?? null;

const getParticipants = (roomId: number) => {
  if (!mockState.participantsByRoomId[roomId]) {
    mockState.participantsByRoomId[roomId] = [];
  }
  return mockState.participantsByRoomId[roomId];
};

const ensureCurrentUser = () => {
  if (mockState.currentUser) return mockState.currentUser;
  const userId = mockState.nextUserId++;
  const user = { userId, nickname: `Tester${userId}` };
  mockState.currentUser = user;
  return user;
};

const ensureOfficerUser = () => {
  const officer = { userId: 2, nickname: "Officer" };
  mockState.currentUser = officer;
  if (mockState.nextUserId <= officer.userId) {
    mockState.nextUserId = officer.userId + 1;
  }
  return officer;
};

const ensureWaitingRoom65 = () => {
  const roomId = 65;
  const meetingTime = formatLocalDateTime(
    new Date(Date.now() + 45 * 60 * 1000),
  );

  const room: MockRoom = {
    roomId,
    title: "Waiting Room 65",
    description: "Mock description for Waiting Room 65.",
    placeName: "Seoul Mock Location",
    lat: 37.4981,
    lng: 127.0276,
    meetingTime,
    status: "WAITING",
    countdownSeconds: 60,
    escapeTime: 30 * 60,
    police_capacity: 1,
    thief_capacity: 2,
  };

  const existing = getRoomById(roomId);
  if (existing) {
    existing.title = room.title;
    existing.description = room.description;
    existing.placeName = room.placeName;
    existing.lat = room.lat;
    existing.lng = room.lng;
    existing.meetingTime = room.meetingTime;
    existing.status = room.status;
    existing.countdownSeconds = room.countdownSeconds;
    existing.escapeTime = room.escapeTime;
    existing.police_capacity = room.police_capacity;
    existing.thief_capacity = room.thief_capacity;
  } else {
    mockState.rooms.unshift(room);
  }

  const hostUser = ensureOfficerUser();
  const existingParticipants = mockState.participantsByRoomId[roomId];
  if (existingParticipants?.length) {
    const officer = existingParticipants.find(
      (participant) => participant.userId === hostUser.userId,
    );
    if (!officer) {
      existingParticipants.unshift({
        userId: hostUser.userId,
        nickname: hostUser.nickname,
        role: "POLICE",
        isArrived: true,
        isAlive: "ALIVE",
        caughtCount: 0,
      });
    } else {
      officer.nickname = hostUser.nickname;
      officer.role = "POLICE";
    }

    return existing ?? room;
  }

  const thiefAId = hostUser.userId === 3 ? 4 : 3;
  const thiefBId = hostUser.userId === 4 || thiefAId === 4 ? 5 : 4;

  mockState.participantsByRoomId[roomId] = [
    {
      userId: hostUser.userId,
      nickname: hostUser.nickname,
      role: "POLICE",
      isArrived: true,
      isAlive: "ALIVE",
      caughtCount: 0,
    },
    {
      userId: thiefAId,
      nickname: "ThiefMate",
      role: "THIEF",
      isArrived: false,
      isAlive: "ALIVE",
      caughtCount: 0,
    },
    {
      userId: thiefBId,
      nickname: "ThiefBuddy",
      role: "THIEF",
      isArrived: true,
      isAlive: "ALIVE",
      caughtCount: 0,
    },
  ];

  return existing ?? room;
};

const pickRole = (
  room: MockRoom,
  participants: ParticipantInfo[],
  rolePreference: Role | "RANDOM",
): Role => {
  if (rolePreference === "POLICE" || rolePreference === "THIEF") {
    return rolePreference;
  }

  const policeCount = participants.filter((p) => p.role === "POLICE").length;
  const thiefCount = participants.filter((p) => p.role === "THIEF").length;

  const policeFull = policeCount >= room.police_capacity;
  const thiefFull = thiefCount >= room.thief_capacity;

  if (policeFull && !thiefFull) return "THIEF";
  if (thiefFull && !policeFull) return "POLICE";
  if (policeFull && thiefFull) return "THIEF";

  return policeCount <= thiefCount ? "POLICE" : "THIEF";
};

export const handlers = [
  http.post("/api/v1/user/session", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      nickname?: string;
    };
    const nickname = body.nickname?.trim() || "Tester";
    const userId = mockState.nextUserId++;
    mockState.currentUser = { userId, nickname };

    return jsonResponse(request, {
      userId,
      nickname,
      accessToken: `mock-token-${userId}`,
      tokenType: "Bearer",
    });
  }),

  http.get("/api/v1/rooms/nearby", ({ request }) => {
    const rooms = mockState.rooms.map((room, index) => {
      const participants = getParticipants(room.roomId);
      const maxParticipants = room.police_capacity + room.thief_capacity;

      return {
        roomId: room.roomId,
        title: room.title,
        placeName: room.placeName,
        lat: room.lat,
        lng: room.lng,
        meetingTime: room.meetingTime,
        currentParticipants: participants.length,
        maxParticipants,
        distance: 0.3 + index * 0.2,
        status: room.status,
      };
    });

    return jsonResponse(request, { rooms, totalCount: rooms.length });
  }),

  http.get("/api/v1/rooms/:roomId", ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = roomId === 65 ? ensureWaitingRoom65() : getRoomById(roomId);

    if (!room) {
      return jsonResponse(request, null, 404);
    }

    const participants = getParticipants(roomId);
    const total = room.police_capacity + room.thief_capacity;

    return jsonResponse(request, {
      roomId: room.roomId,
      title: room.title,
      description: room.description,
      placeName: room.placeName,
      meetingTime: room.meetingTime,
      status: room.status,
      countdownSeconds: room.countdownSeconds,
      escapeTime: room.escapeTime,
      police_capacity: room.police_capacity,
      thief_capacity: room.thief_capacity,
      capacity: {
        current: participants.length,
        total,
      },
      participants,
    });
  }),

  http.post("/api/v1/rooms", async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      description?: string;
      placeName?: string;
      lat: number;
      lng: number;
      meetingTime: string;
      police_capacity: number;
      thief_capacity: number;
      countdownSeconds: number;
      escapeTime: number;
    };

    const roomId = mockState.nextRoomId++;
    const host = ensureCurrentUser();

    const room: MockRoom = {
      roomId,
      title: body.title ?? "New Room",
      description: body.description ?? "Mock description.",
      placeName: body.placeName ?? "Unknown Place",
      lat: body.lat,
      lng: body.lng,
      meetingTime: body.meetingTime,
      status: "WAITING",
      countdownSeconds: body.countdownSeconds,
      escapeTime: body.escapeTime,
      police_capacity: body.police_capacity,
      thief_capacity: body.thief_capacity,
    };

    mockState.rooms.unshift(room);
    mockState.participantsByRoomId[roomId] = [
      {
        userId: host.userId,
        nickname: host.nickname,
        role: "POLICE",
        isArrived: false,
        isAlive: "ALIVE",
        caughtCount: 0,
      },
    ];

    return jsonResponse(request, {
      roomId,
      hostId: host.userId,
    });
  }),

  http.post("/api/v1/rooms/:roomId/join", async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = getRoomById(roomId);

    if (!room) {
      return jsonResponse(request, null, 404);
    }

    const body = (await request.json().catch(() => ({}))) as {
      rolePreference?: Role | "RANDOM";
    };

    const rolePreference = body.rolePreference ?? "RANDOM";
    const participants = getParticipants(roomId);
    const currentUser = ensureCurrentUser();

    const existing = participants.find(
      (participant) => participant.userId === currentUser.userId,
    );

    if (!existing) {
      const role = pickRole(room, participants, rolePreference);
      participants.push({
        userId: currentUser.userId,
        nickname: currentUser.nickname,
        role,
        isArrived: false,
        isAlive: "ALIVE",
        caughtCount: 0,
      });
    }

    return jsonResponse(request, {
      roomId,
      userId: currentUser.userId,
      rolePreference,
      message: "joined",
    });
  }),

  http.delete("/api/v1/rooms/:roomId/leave", ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = getRoomById(roomId);

    if (!room) {
      return jsonResponse(request, null, 404);
    }

    const participants = getParticipants(roomId);
    const currentUser = ensureCurrentUser();
    const targetIndex = participants.findIndex(
      (participant) => participant.userId === currentUser.userId,
    );

    if (targetIndex < 0) {
      return jsonResponse(request, null, 400);
    }

    participants.splice(targetIndex, 1);

    if (participants.length === 0) {
      mockState.rooms = mockState.rooms.filter(
        (existingRoom) => existingRoom.roomId !== roomId,
      );
      delete mockState.participantsByRoomId[roomId];
    }

    return jsonResponse(request, {
      roomId,
      userId: currentUser.userId,
      message: "left",
    });
  }),

  http.get("/api/v1/rooms/:roomId/participants", ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = roomId === 65 ? ensureWaitingRoom65() : getRoomById(roomId);

    if (!room) {
      return jsonResponse(request, null, 404);
    }

    const participants = getParticipants(roomId);
    return jsonResponse(request, { roomId, participants });
  }),

  http.patch(
    "/api/v1/rooms/:roomId/participants/:userId/arrival",
    ({ params, request }) => {
      const roomId = Number(params.roomId);
      const userId = Number(params.userId);
      const room = getRoomById(roomId);

      if (!room) {
        return jsonResponse(request, null, 404);
      }

      const participants = getParticipants(roomId);
      const target = participants.find((p) => p.userId === userId);

      if (!target) {
        return jsonResponse(request, null, 404);
      }

      target.isArrived = !target.isArrived;
      return jsonResponse(request, {});
    },
  ),

  http.patch(
    "/api/v1/rooms/:roomId/participants/:thiefId/capture",
    ({ params, request }) => {
      const roomId = Number(params.roomId);
      const thiefId = Number(params.thiefId);
      const room = getRoomById(roomId);

      if (!room) {
        return jsonResponse(request, null, 404);
      }

      const participants = getParticipants(roomId);
      const target = participants.find((p) => p.userId === thiefId);
      const currentUser = ensureCurrentUser();
      const police = participants.find(
        (participant) => participant.userId === currentUser.userId,
      );

      if (target) {
        target.isAlive = "CAUGHT";
      }

      if (police && police.role === "POLICE") {
        police.caughtCount = (police.caughtCount ?? 0) + 1;
      }

      return jsonResponse(request, {
        thiefUserId: thiefId,
        thiefNickname: target?.nickname ?? "Thief",
        policeUserId: currentUser.userId,
        policeNickname: currentUser.nickname,
        remainingThieves: participants.filter(
          (p) => p.role === "THIEF" && p.isAlive !== "CAUGHT",
        ).length,
        message: "captured",
      });
    },
  ),

  http.patch(
    "/api/v1/rooms/:roomId/participants/release",
    ({ params, request }) => {
      const roomId = Number(params.roomId);
      const room = getRoomById(roomId);

      if (!room) {
        return jsonResponse(request, null, 404);
      }

      const participants = getParticipants(roomId);
      const currentUser = ensureCurrentUser();
      const target = participants.find(
        (participant) => participant.userId === currentUser.userId,
      );

      if (target) {
        target.isAlive = "ALIVE";
      }

      return jsonResponse(request, {
        thiefUserId: currentUser.userId,
        thiefNickname: currentUser.nickname,
        remainingThieves: participants.filter(
          (p) => p.role === "THIEF" && p.isAlive !== "CAUGHT",
        ).length,
        message: "released",
      });
    },
  ),

  http.patch("/api/v1/rooms/:roomId/roles", async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = getRoomById(roomId);

    if (!room) {
      return jsonResponse(request, null, 404);
    }

    const body = (await request.json().catch(() => ({}))) as {
      roles?: Array<{ userId: number; role: Role }>;
    };

    const participants = getParticipants(roomId);
    const roles = body.roles ?? [];

    roles.forEach((assignment) => {
      const target = participants.find(
        (participant) => participant.userId === assignment.userId,
      );
      if (target) {
        target.role = assignment.role;
      }
    });

    room.status = "PLAYING";

    const totalPolice = participants.filter((p) => p.role === "POLICE").length;
    const totalThieves = participants.filter((p) => p.role === "THIEF").length;

    return jsonResponse(request, {
      roomId,
      stats: { totalPolice, totalThieves },
      participants,
    });
  }),

  http.post("/api/v1/rooms/:roomId/game/finish", async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const room = getRoomById(roomId);

    if (!room) {
      return jsonResponse(request, null, 404);
    }

    room.status = "FINISHED";

    const participants = getParticipants(roomId).map((participant) => ({
      userId: participant.userId,
      nickname: participant.nickname,
      role: participant.role,
      isAlive: participant.isAlive ?? "ALIVE",
      isArrived: participant.isArrived,
      caughtCount: participant.caughtCount ?? 0,
    }));

    const nowTime = new Date();

    return jsonResponse(request, {
      startTime: formatLocalDateTime(
        new Date(nowTime.getTime() - room.escapeTime * 1000),
      ),
      endTime: formatLocalDateTime(nowTime),
      participants,
    });
  }),
];
