// backend/src/common/interfaces/analytics-entry.interface.ts

export interface AnalyticsEntry {
  gameId: string;
  playerId: string;
  eventType: string;
  value?: number | string | boolean | object;
  timestamp: Date;
  sessionId?: string;
  metadata?: {
    [key: string]: any;
  };
}