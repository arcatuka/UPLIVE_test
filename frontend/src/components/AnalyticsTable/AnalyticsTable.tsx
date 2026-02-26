// frontend/src/components/AnalyticsTable/AnalyticsTable.tsx

import React from 'react';
import styles from './AnalyticsTable.module.css';
import '../../App.css'; // Import global CSS for alerts
import type { AnalyticsEntry } from '../../common/interfaces/analytics-entry.interface';

interface AnalyticsTableProps {
  data: AnalyticsEntry[];
  loading: boolean;
  error: string | null;
}

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ data, loading, error }) => {
  // Only show loading if no data is present yet or filtering is happening for the first time
  if (loading && !data.length && (!error)) {
    return <div className={`${styles.container} alert alert-info`}>Loading analytics data...</div>;
  }
  if (error && !data.length) { // Only show error if no data could be loaded initially
    return <div className={`${styles.container} alert alert-danger`}>Error: {error}</div>;
  }
  if (!data || data.length === 0) return <div className={styles.container}><p>No analytics entries to display.</p></div>;

  return (
    <div className={styles.container}>
      <h2>All Analytics Entries</h2>
      {/* Subtle indicator if data is refreshing but already present */}
      {loading && data.length > 0 && <div className={`alert alert-info ${styles.subtleLoading}`}>Refreshing data...</div>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Game ID</th>
              <th>Player ID</th>
              <th>Event Type</th>
              <th>Value</th>
              <th>Timestamp</th>
              <th>Session ID</th>
              <th>Metadata</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index}>
                <td>{entry.gameId}</td>
                <td>{entry.playerId}</td>
                <td>{entry.eventType}</td>
                <td>{JSON.stringify(entry.value)}</td>
                <td>{entry.timestamp.toLocaleString()}</td>
                <td>{entry.sessionId || 'N/A'}</td>
                <td>{entry.metadata ? JSON.stringify(entry.metadata) : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsTable;