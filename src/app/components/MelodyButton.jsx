'use client';

import { memo } from 'react';

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

export default memo(MelodyButton);
