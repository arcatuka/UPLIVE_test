// frontend/src/components/AnalyticsForm/AnalyticsForm.tsx

import React, { useState } from 'react';
import styles from './AnalyticsForm.module.css';
import '../../App.css'; // Import global CSS for alerts

// Interface for the form state, closely matches the DTO
interface AnalyticsFormState {
  gameId: string;
  playerId: string;
  eventType: string;
  value: string; // Store as string in form for easy input
  sessionId: string;
  metadata: string; // Store as string in form for easy input (JSON)
  timestamp?: string; // Optional timestamp input
}

// Define the type for the payload that will be sent to the onSubmit prop
interface EntryToSend {
  gameId: string;
  playerId: string;
  eventType: string;
  value?: number | string | boolean | object; // This union type is what the API expects
  sessionId?: string;
  metadata?: { [key: string]: any };
  timestamp?: string | Date;
}

interface AnalyticsFormProps {
  onSubmit: (entry: EntryToSend) => Promise<void>; // onSubmit now expects EntryToSend
  loading: boolean; // Global loading state from Dashboard
  error: string | null; // Global error state from Dashboard
}

const AnalyticsForm: React.FC<AnalyticsFormProps> = ({ onSubmit, loading, error }) => {
  const [formState, setFormState] = useState<AnalyticsFormState>({
    gameId: 'test-game-001',
    playerId: `player-${Math.floor(Math.random() * 10000)}`,
    eventType: 'level_start',
    value: '1', // Default value as string
    sessionId: `session-${Date.now()}`,
    metadata: '{}', // Default metadata as empty JSON string
    timestamp: new Date().toISOString(), // Default to current ISO string
  });
  const [submitError, setSubmitError] = useState<string | null>(null); // Local error for form submission

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null); // Clear previous local errors

    try {
      let parsedValue: number | string | boolean | object | undefined;
      if (formState.value.trim() !== '') {
        try {
          parsedValue = JSON.parse(formState.value);
        } catch (jsonError) {
          if (!isNaN(Number(formState.value)) && !isNaN(parseFloat(formState.value))) {
            parsedValue = Number(formState.value);
          } else if (formState.value.toLowerCase() === 'true') {
            parsedValue = true;
          } else if (formState.value.toLowerCase() === 'false') {
            parsedValue = false;
          } else {
            parsedValue = formState.value;
          }
        }
      }

      let parsedMetadata: { [key: string]: any } | undefined;
      if (formState.metadata.trim() !== '') {
        try {
          parsedMetadata = JSON.parse(formState.metadata);
        } catch (metaError) {
          throw new Error('Invalid JSON for metadata.');
        }
      }

      const entryToSend: EntryToSend = {
        gameId: formState.gameId,
        playerId: formState.playerId,
        eventType: formState.eventType,
        value: parsedValue,
        sessionId: formState.sessionId.trim() !== '' ? formState.sessionId : undefined,
        metadata: parsedMetadata,
        timestamp: formState.timestamp && formState.timestamp.trim() !== '' ? formState.timestamp : undefined,
      };

      await onSubmit(entryToSend); // Call the onSubmit prop from Dashboard

      // Reset form or generate new defaults after successful submission
      setFormState({
        gameId: 'test-game-001',
        playerId: `player-${Math.floor(Math.random() * 10000)}`,
        eventType: 'level_start',
        value: '1',
        sessionId: `session-${Date.now()}`,
        metadata: '{}',
        timestamp: new Date().toISOString(),
      });

    } catch (err: any) {
      // Catch specific errors from onSubmit (e.g., backend validation errors)
      setSubmitError(err.message || 'Failed to add entry.');
      console.error('Form submission error:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Analytics Entry</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Local form submission error */}
        {submitError && <p className={`${styles.submitError} alert alert-danger`}>{submitError}</p>}
        {/* Global error from dashboard, for context */}
        {error && !submitError && <p className={`${styles.submitError} alert alert-danger`}>Dashboard Error: {error}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="gameId">Game ID:</label>
          <input type="text" id="gameId" name="gameId" value={formState.gameId} onChange={handleChange} required disabled={loading} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="playerId">Player ID:</label>
          <input type="text" id="playerId" name="playerId" value={formState.playerId} onChange={handleChange} required disabled={loading} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="eventType">Event Type:</label>
          <input type="text" id="eventType" name="eventType" value={formState.eventType} onChange={handleChange} required disabled={loading} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="value">Value (e.g., 100, "item_id", true, {"{ \"key\": \"val\" }"}):</label>
          <textarea id="value" name="value" value={formState.value} onChange={handleChange} rows={2} disabled={loading} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sessionId">Session ID (optional):</label>
          <input type="text" id="sessionId" name="sessionId" value={formState.sessionId} onChange={handleChange} disabled={loading} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="metadata">Metadata (JSON string, optional):</label>
          <textarea id="metadata" name="metadata" value={formState.metadata} onChange={handleChange} rows={3} disabled={loading} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timestamp">Timestamp (ISO string, optional, defaults to now):</label>
          <input type="text" id="timestamp" name="timestamp" value={formState.timestamp} onChange={handleChange} disabled={loading} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Entry'}
        </button>
      </form>
    </div>
  );
};

export default AnalyticsForm;