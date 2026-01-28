'use client';

import { memo, useCallback, useRef } from 'react';

/**
 * Individual piano key component.
 * Simple click-to-play behavior (no hold).
 * Memoized to prevent unnecessary re-renders.
 *
 * @param {Object} props
 * @param {string} props.note - Note name (e.g., "C4", "C#4")
 * @param {string} props.keyBinding - Keyboard key binding
 * @param {boolean} props.isBlack - Whether this is a black key
 * @param {boolean} props.isActive - Whether the key is currently pressed
 * @param {Function} props.onNoteStart - Callback when note should play
 */
function PianoKey({
  note,
  keyBinding,
  isBlack,
  isActive,
  onNoteStart,
}) {
  const touchHandledRef = useRef(false);

  /**
   * Handle click - play note once.
   * Skip if we already played from touch (avoids double-play on touch devices).
   */
  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (touchHandledRef.current) {
        touchHandledRef.current = false;
        return;
      }
      onNoteStart(note);
    },
    [note, onNoteStart]
  );

  /**
   * Handle touch start - play note (mobile support).
   * Set flag so the synthesized click does not play again; clear after a tick
   * in case no click follows (e.g. touch-and-drag).
   */
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      touchHandledRef.current = true;
      onNoteStart(note);
      setTimeout(() => {
        touchHandledRef.current = false;
      }, 300);
    },
    [note, onNoteStart]
  );

  /**
   * Prevent double-click text selection
   */
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Build class names
  const classNames = [
    'piano-key',
    isBlack ? 'piano-key--black' : 'piano-key--white',
    isActive ? 'piano-key--active' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
      aria-label={`Piano key ${note}`}
      type="button"
    >
      <span className="piano-key__label">
        {keyBinding.toUpperCase()}
      </span>
    </button>
  );
}

// Memoize to prevent re-renders when other keys change
export default memo(PianoKey, (prevProps, nextProps) => {
  return (
    prevProps.note === nextProps.note &&
    prevProps.keyBinding === nextProps.keyBinding &&
    prevProps.isBlack === nextProps.isBlack &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.onNoteStart === nextProps.onNoteStart
  );
});
