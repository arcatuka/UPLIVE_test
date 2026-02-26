// frontend/src/components/SummaryStats/SummaryStats.tsx

import React from 'react';
import styles from './SummaryStats.module.css';
import '../../App.css'; // Import global CSS for alerts

interface AnalyticsSummary {
  totalEntries: number;
  uniquePlayers: number;
  uniqueGames: number;
  eventTypeCounts: { [eventType: string]: number };
  lastEntryTimestamp: Date | null;
}

interface SummaryStatsProps {
  summary: AnalyticsSummary | null;
  loading: boolean;
  error: string | null;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ summary, loading, error }) => {
  // If parent is loading, this component shows its own loading state
  if (loading && !summary) { // Only show loading if there's no data yet
    return <div className={`${styles.container} alert alert-info`}>Loading summary...</div>;
  }
  if (error && !summary) { // Only show error if no summary could be loaded initially
    return <div className={`${styles.container} alert alert-danger`}>Error: {error}</div>;
  }
  if (!summary) return <div className={styles.container}><p>No summary data available.</p></div>;

  const sortedEventTypeCounts = Object.entries(summary.eventTypeCounts)
    .sort(([, countA], [, countB]) => countB - countA);

    const getColorFromString = (str: string) => {
      let hash = 0;
    
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
    
      // Keep it positive
      const normalizedHash = Math.abs(hash);
      
    
      // Restrict hue to blue range (200–220)
      const hue = 200 + (normalizedHash % 20);
    
      return `hsl(${hue}, 70%, 50%)`;
    };
  return (
    <div className={styles.container}>
      <h2>Analytics Summary</h2>
      {/* If loading and there IS summary data, you might show a subtle indicator here, not block the content */}
      {loading && summary && <div className={`alert alert-info ${styles.subtleLoading}`}>Refreshing summary...</div>}
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <h3>Total Entries</h3>
          <p>{summary.totalEntries}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Unique Players</h3>
          <p>{summary.uniquePlayers}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Unique Games</h3>
          <p>{summary.uniqueGames}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Last Entry</h3>
          <p>{summary.lastEntryTimestamp?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>

      {sortedEventTypeCounts.length > 0 && (
        <div className={styles.eventTypeCounts}>
          <h3>Event Type Breakdown:</h3>
          <ul>
            {sortedEventTypeCounts.map(([type, count]) => (
              <li
  key={type}
  style={{
    borderColor: getColorFromString(type),
  }}
>
  <span
    className={styles.colorDot}
    style={{ backgroundColor: getColorFromString(type) }}
  />
  <strong>{type}</strong>
  <span
    className={styles.countBadge}
    style={{ backgroundColor: getColorFromString(type) }}
  >
    {count}
  </span>
</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SummaryStats;