// frontend/src/components/Dashboard/Dashboard.tsx

import React, { useEffect, useState, useCallback } from 'react';
import type { AnalyticsEntry } from '../../common/interfaces/analytics-entry.interface';
import AnalyticsTable from '../AnalyticsTable/AnalyticsTable';
import AnalyticsForm from '../AnalyticsForm/AnalyticsForm';
import SummaryStats from '../SummaryStats/SummaryStats';
import styles from './Dashboard.module.css';
import '../../App.css';
import AnalyticsApiService from '../../services/analytics-api-client';
import AnalyticsChart from '../AnalyticsChart/AnalyticsChart';

interface AnalyticsSummary {
  totalEntries: number;
  uniquePlayers: number;
  uniqueGames: number;
  eventTypeCounts: { [eventType: string]: number };
  lastEntryTimestamp: Date | null;
}

function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsEntry[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterGameId, setFilterGameId] = useState('');
  const [filterEventType, setFilterEventType] = useState('');

  const fetchData = useCallback(async (gameId?: string, eventType?: string) => {
    setLoading(true);
    setError(null);
    try {
      const [dataResponse, summaryResponse] = await Promise.all([
        AnalyticsApiService.fetchAnalytics({
          gameId: gameId || undefined,
          eventType: eventType || undefined,
        }),
        AnalyticsApiService.fetchAnalyticsSummary(),
      ]);
      setAnalyticsData(dataResponse);
      setSummary(summaryResponse);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'An unknown error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(filterGameId, filterEventType);
  }, [fetchData, filterGameId, filterEventType]);

  const handleAddEntry = useCallback(async (entryData: any) => {
    setLoading(true);
    setError(null);
    try {
      await AnalyticsApiService.addAnalyticsEntry(entryData);
      await fetchData(filterGameId, filterEventType);
    } catch (err: any) {
      console.error('Failed to add analytics entry:', err);
      setError(err.response?.data?.message || err.message || 'An unknown error occurred while adding entry.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchData, filterGameId, filterEventType]);

  return (
    <div className={styles.dashboard}>
      <h1>Game Analytics Dashboard</h1>

      {loading && <div className={`${styles.globalLoading} alert alert-info`}>Loading data...</div>}
      {error && <div className={`${styles.globalError} alert alert-danger`}>{error}</div>}

      {/* NEW CONTENT GRID WRAPPER */}
        {/* Analytics Summary */}
        <SummaryStats summary={summary} loading={loading} error={error} />
        
        {/* Analytics Form */}
      {/* END NEW CONTENT GRID WRAPPER */}
      {/* Chart Section */}
      {summary && (
  <div style={{ marginBottom: '30px' }}>
<div className={styles.chartContainer}>
  <AnalyticsChart eventTypeCounts={summary.eventTypeCounts} />
</div>  </div>
)}
        <AnalyticsForm onSubmit={handleAddEntry} loading={loading} error={error} />

      {/* FILTER SECTION - MOVED HERE, closer to the table */}
      <div className={styles.filterContainer}>
        <h3>Filter Analytics</h3>
        <div className={styles.filterGroup}>
          <label htmlFor="filterGameId">Game ID:</label>
          <input
            type="text"
            id="filterGameId"
            value={filterGameId}
            onChange={(e) => setFilterGameId(e.target.value)}
            placeholder="e.g., test-game-001"
            disabled={loading}
          />
        </div>
        <div className={styles.filterGroup}>
          <label htmlFor="filterEventType">Event Type:</label>
          <input
            type="text"
            id="filterEventType"
            value={filterEventType}
            onChange={(e) => setFilterEventType(e.target.value)}
            placeholder="e.g., level_start"
            disabled={loading}
          />
        </div>
      </div>
      {/* END FILTER SECTION */}

      {/* Analytics Table */}
      <AnalyticsTable data={analyticsData} loading={loading} error={error} />
    </div>
  );
}

export default Dashboard;