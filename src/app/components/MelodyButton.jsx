'use client';

import { memo, useState, useEffect, useCallback } from 'react';

/**
 * Melody button component - plays a pre-defined sequence of notes.
 * Click to play, click again to stop.
 * 
 * @param {Object} props
 * @param {string} props.name - Display name of the melody
 * @param {boolean} props.isPlaying - Whether this melody is currently playing
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {Function} props.onPlay - Callback when melody should start/stop
 */
function MelodyButton({ 
  name, 
  isPlaying, 
  disabled,
  onPlay 
}) {
  const handleClick = () => {
    if (!disabled) {
      onPlay();
    }
  };

  const classNames = [
    'piano-key',
    'melody-button',
    isPlaying ? 'melody-button--playing' : '',
    disabled ? 'melody-button--disabled' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isPlaying ? `Stop melody: ${name}` : `Play melody: ${name}`}
      type="button"
    >
      <span className="melody-button__icon">
        {isPlaying ? '■' : '▶'}
      </span>
      <span className="melody-button__label">
        {name}
      </span>
    </button>
  );
}

/**
 * SavedMelodyList component - fetches and displays saved melodies from database.
 * Handles loading, error states, and provides play/delete functionality.
 * 
 * @param {Object} props
 * @param {string|null} props.playingMelodyId - ID of currently playing melody
 * @param {boolean} props.disabled - Whether buttons should be disabled
 * @param {Function} props.onPlay - Callback when a melody should play
 * @param {Function} props.onMelodiesLoaded - Optional callback when melodies are loaded
 */
export function SavedMelodyList({
  playingMelodyId,
  disabled,
  onPlay,
  onMelodiesLoaded,
}) {
  const [melodies, setMelodies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch saved melodies from Neon database
   */
  const fetchMelodies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/piano/list');
      if (!response.ok) {
        throw new Error('Failed to fetch melodies');
      }
      const data = await response.json();
      setMelodies(data);
      onMelodiesLoaded?.(data);
    } catch (err) {
      console.error('Error fetching saved melodies:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [onMelodiesLoaded]);

  /**
   * Delete a melody from the database
   */
  const deleteMelody = useCallback(async (melodyId) => {
    try {
      const response = await fetch('/api/piano/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: melodyId }),
      });

      if (response.ok) {
        setMelodies(prev => prev.filter(m => m.id !== melodyId));
      }
    } catch (err) {
      console.error('Error deleting melody:', err);
    }
  }, []);

  /**
   * Add a new melody to the list (called after generation)
   */
  const addMelody = useCallback((melody) => {
    setMelodies(prev => [melody, ...prev]);
  }, []);

  // Fetch melodies on mount
  useEffect(() => {
    fetchMelodies();
  }, [fetchMelodies]);

  // Expose addMelody for parent components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__addSavedMelody = addMelody;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.__addSavedMelody;
      }
    };
  }, [addMelody]);

  if (isLoading) {
    return <p className="piano__status">Loading saved melodies...</p>;
  }

  if (error) {
    return (
      <p className="piano__status piano__status--error">
        Error loading melodies: {error}
      </p>
    );
  }

  if (melodies.length === 0) {
    return null;
  }

  return (
    <div className="piano__melodies">
      <p className="piano__melodies-label">Your saved melodies:</p>
      <div className="piano__melody-buttons">
        {melodies.map((melody) => (
          <div key={melody.id} className="piano__saved-melody">
            <MelodyButton
              name={melody.name}
              isPlaying={playingMelodyId === melody.id}
              disabled={disabled}
              onPlay={() => onPlay(melody)}
            />
            <button
              className="piano__delete-button"
              onClick={() => deleteMelody(melody.id)}
              aria-label={`Delete ${melody.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(MelodyButton);
