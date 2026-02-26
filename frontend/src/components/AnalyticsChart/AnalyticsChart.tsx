import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  eventTypeCounts: { [eventType: string]: number } | undefined;
}

const AnalyticsChart: React.FC<Props> = ({ eventTypeCounts }) => {
  if (!eventTypeCounts) return null;

  const data = Object.entries(eventTypeCounts).map(([eventType, count]) => ({
    eventType,
    count,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h3 style={{ marginBottom: '10px' }}>Event Type Distribution</h3>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="eventType" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;