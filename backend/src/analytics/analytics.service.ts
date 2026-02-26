// backend/src/analytics/analytics.service.ts

import { Injectable } from '@nestjs/common';
import { AnalyticsEntry } from '../common/interfaces/analytics-entry.interface'; // Adjust path if needed

@Injectable()
export class AnalyticsService {
  private analyticsEntries: AnalyticsEntry[] = []; // In-memory storage

  /**
   * Returns all stored analytics entries.
   */
  findAll(): AnalyticsEntry[] {
    return this.analyticsEntries;
  }

  /**
   * Adds a new analytics entry to the in-memory storage.
   * Automatically sets the timestamp if not provided.
   * @param entry The analytics entry to create.
   * @returns The created analytics entry with a timestamp.
   */
  
  create(entry: Omit<AnalyticsEntry, 'timestamp'> & { timestamp?: Date | string }): AnalyticsEntry {
    const newEntry: AnalyticsEntry = {
      ...entry,
      timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date(), // Ensure timestamp is a Date object
    };
    this.analyticsEntries.push(newEntry);
    console.log('New analytics entry created:', newEntry); // For debugging
    return newEntry;
  }

  /**
   * Provides a summary of the analytics data.
   * For now, it counts events by type and unique players.
   * This can be expanded significantly.
   */
  getSummary() {
    const totalEntries = this.analyticsEntries.length;
    const eventTypeCounts: { [eventType: string]: number } = {};
    const uniquePlayers = new Set<string>();
    const uniqueGames = new Set<string>();

    this.analyticsEntries.forEach(entry => {
      eventTypeCounts[entry.eventType] = (eventTypeCounts[entry.eventType] || 0) + 1;
      uniquePlayers.add(entry.playerId);
      uniqueGames.add(entry.gameId);
    });

    return {
      totalEntries,
      uniquePlayers: uniquePlayers.size,
      uniqueGames: uniqueGames.size,
      eventTypeCounts,
      lastEntryTimestamp: totalEntries > 0
        ? this.analyticsEntries[totalEntries - 1].timestamp
        : null,
    };
  }

  /**
   * Clears all analytics entries. Useful for testing or resetting.
   */
  clearAllEntries() {
    this.analyticsEntries = [];
    console.log('All analytics entries cleared.');
  }
}