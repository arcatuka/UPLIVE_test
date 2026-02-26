// frontend/src/services/analytics-api.service.ts

import axios from 'axios';
import type { AnalyticsEntry } from '../common/interfaces/analytics-entry.interface'; // Re-use the shared interface

// Define the shape of the analytics summary response
interface AnalyticsSummary {
  totalEntries: number;
  uniquePlayers: number;
  uniqueGames: number;
  eventTypeCounts: { [eventType: string]: number };
  lastEntryTimestamp: Date | null; // Can be string from API, or Date if converted
}

// Configuration for your NestJS backend
const API_BASE_URL = 'http://localhost:3000/analytics'; // Ensure this matches your backend's URL and port

// Axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important if your backend uses 'credentials: true' for CORS
});

/**
 * Interface for the payload when creating an analytics entry.
 * Note: 'timestamp' is optional here as the backend can generate it.
 * If you always want to send it, you can make it non-optional.
 */
interface CreateAnalyticsEntryPayload extends Omit<AnalyticsEntry, 'timestamp'> {
  timestamp?: string | Date; // Allow Date object or ISO string for sending
}

const AnalyticsApiService = {
  /**
   * Fetches analytics entries from the backend.
   * Supports optional filtering by gameId and eventType.
   * @param filters Optional object with gameId and/or eventType.
   * @returns A promise that resolves to an array of AnalyticsEntry.
   */
  fetchAnalytics: async (filters?: { gameId?: string; eventType?: string }): Promise<AnalyticsEntry[]> => {
    try {
      const response = await api.get<AnalyticsEntry[]>('', { params: filters });
      // Convert timestamp strings to Date objects for frontend consumption
      return response.data.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  /**
   * Adds a new analytics entry to the backend.
   * @param entry The analytics entry data to send.
   * @returns A promise that resolves to the created AnalyticsEntry.
   */
  addAnalyticsEntry: async (entry: CreateAnalyticsEntryPayload): Promise<AnalyticsEntry> => {
    try {
      // Ensure timestamp is an ISO string if it's a Date object for API consistency
      const payload = {
        ...entry,
        timestamp: entry.timestamp instanceof Date ? entry.timestamp.toISOString() : entry.timestamp,
      };
      const response = await api.post<AnalyticsEntry>('', payload);
      // Convert timestamp string to Date object for frontend consumption
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
      };
    } catch (error) {
      console.error('Error adding analytics entry:', error);
      throw error;
    }
  },

  /**
   * Fetches a summary of the analytics data from the backend.
   * @returns A promise that resolves to an AnalyticsSummary object.
   */
  fetchAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    try {
      const response = await api.get<AnalyticsSummary>('/summary');
      // Convert lastEntryTimestamp to Date object if it exists
      if (response.data.lastEntryTimestamp) {
        response.data.lastEntryTimestamp = new Date(response.data.lastEntryTimestamp);
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      throw error;
    }
  },
};

export default AnalyticsApiService;