import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface WebSocketMessage {
  eventType: "THIEF_CAPTURED" | "ESCAPE_SUCCESS" | "GAME_FINISHED";
  data: unknown;
}

export interface ThiefCapturedData {
  thiefUserId: number;
  thiefNickname: string;
  policeUserId: number;
  policeNickname: string;
  remainingThieves: number;
}

export interface EscapeSuccessData {
  thiefUserId: number;
  thiefNickname: string;
  remainingThieves: number;
}

export interface GameFinishedData {
  startTime: string;
  endTime: string;
  participants: Array<{
    userId: number;
    nickname: string;
    role: string;
    status: string;
  }>;
}

type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketService {
  private client: Client | null = null;
  private messageHandlers: MessageHandler[] = [];
  private isConnecting = false;
  private roomId: string | null = null;

  connect(roomId: string, onConnected?: () => void): void {
    if (this.client?.connected || this.isConnecting) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    this.isConnecting = true;
    this.roomId = roomId;
    console.log(`Connecting to WebSocket for room: ${roomId}`);

    const serverUrl = import.meta.env.VITE_SERVER_API_URL || "https://hackathon2026.kro.kr";
    const wsUrl = serverUrl.replace(/^http/, "ws") + "/ws";

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log("[STOMP Debug]", str);
      },
      onConnect: () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        this.subscribeToRoom(roomId);
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
        this.isConnecting = false;
      },
      onWebSocketError: (error) => {
        console.error("WebSocket error", error);
        this.isConnecting = false;
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected");
        this.isConnecting = false;
      },
    });

    this.client.activate();
  }

  private subscribeToRoom(roomId: string): void {
    if (!this.client?.connected) {
      console.error("Cannot subscribe: WebSocket not connected");
      return;
    }

    const topic = `/topic/room/${roomId}`;
    console.log(`Subscribing to ${topic}`);

    this.client.subscribe(topic, (message) => {
      try {
        const parsedMessage: WebSocketMessage = JSON.parse(message.body);
        console.log("Received WebSocket message:", parsedMessage);
        this.notifyHandlers(parsedMessage);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    });
  }

  addMessageHandler(handler: MessageHandler): void {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: MessageHandler): void {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }

  private notifyHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      console.log(`Disconnecting WebSocket from room: ${this.roomId}`);
      this.client.deactivate();
      this.client = null;
      this.messageHandlers = [];
      this.isConnecting = false;
      this.roomId = null;
    }
  }

  isConnected(): boolean {
    return this.client?.connected || false;
  }
}

export const webSocketService = new WebSocketService();
