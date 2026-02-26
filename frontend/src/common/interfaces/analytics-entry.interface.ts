// frontend/src/common/interfaces/analytics-entry.interface.ts

export interface AnalyticsEntry {
    gameId: string;
    playerId: string;
    eventType: string;
    value?: number | string | boolean | object;
    timestamp: Date; // Important: Frontend will work with Date objects
    sessionId?: string;
    metadata?: {
      [key: string]: any;
    };
  }