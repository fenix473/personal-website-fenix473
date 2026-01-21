'use client';

import { memo, useCallback, useRef } from 'react';

/**
 * Individual piano key component.
 * Handles mouse and touch events for audio playback.
 * Memoized to prevent unnecessary re-renders.
 * 
 * @param {Object} props
 * @param {string} props.note - Note name (e.g., "C4", "C#4")
 * @param {string} props.keyBinding - Keyboard key binding
 * @param {boolean} props.isBlack - Whether this is a black key
 * @param {boolean} props.isActive - Whether the key is currently pressed
 * @param {Function} props.onNoteStart - Callback when note should start
 * @param {Function} props.onNoteEnd - Callback when note should end
 */
function PianoKey({ 
  note, 
  keyBinding, 
  isBlack, 
  isActive, 
  onNoteStart, 
  onNoteEnd 
}) {
  const isMouseDownRef = useRef(false);

  /**
   * Handle mouse down - start playing note
   */
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    isMouseDownRef.current = true;
    onNoteStart(note);
  }, [note, onNoteStart]);

  /**
   * Handle mouse up - stop playing note
   */
  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      onNoteEnd(note);
    }
  }, [note, onNoteEnd]);

  /**
   * Handle mouse leave - stop note if mouse was pressed
   */
  const handleMouseLeave = useCallback(() => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      onNoteEnd(note);
    }
  }, [note, onNoteEnd]);

  /**
   * Handle touch start - start playing note (mobile support)
   */
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    onNoteStart(note);
  }, [note, onNoteStart]);

  /**
   * Handle touch end - stop playing note (mobile support)
   */
  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    onNoteEnd(note);
  }, [note, onNoteEnd]);

  // Build class names
  const classNames = [
    'piano-key',
    isBlack ? 'piano-key--black' : 'piano-key--white',
    isActive ? 'piano-key--active' : ''
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
    prevProps.onNoteStart === nextProps.onNoteStart &&
    prevProps.onNoteEnd === nextProps.onNoteEnd
  );
});
