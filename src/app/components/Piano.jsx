'use client';

import { useMemo, useCallback, useState, useRef } from 'react';
import PianoKey from './PianoKey';
import MelodyButton from './MelodyButton';
import useAudioPlayer from '../hooks/useAudioPlayer';
import useKeyPress from '../hooks/useKeyPress';
import '../css/Piano.css';

/**
 * Piano key configuration for one octave (C4 to B4).
 * Each key includes note name, keyboard binding, type, and audio path.
 */
const PIANO_KEYS = [
  { note: 'C4', keyBinding: 'a', isBlack: false, audioPath: '/sounds/piano/C4.ogg' },
  { note: 'C#4', keyBinding: 'w', isBlack: true, audioPath: '/sounds/piano/C-sharp-4.ogg' },
  { note: 'D4', keyBinding: 's', isBlack: false, audioPath: '/sounds/piano/D4.ogg' },
  { note: 'D#4', keyBinding: 'e', isBlack: true, audioPath: '/sounds/piano/D-sharp-4.ogg' },
  { note: 'E4', keyBinding: 'd', isBlack: false, audioPath: '/sounds/piano/E4.ogg' },
  { note: 'F4', keyBinding: 'f', isBlack: false, audioPath: '/sounds/piano/F4.ogg' },
  { note: 'F#4', keyBinding: 't', isBlack: true, audioPath: '/sounds/piano/F-sharp-4.ogg' },
  { note: 'G4', keyBinding: 'g', isBlack: false, audioPath: '/sounds/piano/G4.ogg' },
  { note: 'G#4', keyBinding: 'y', isBlack: true, audioPath: '/sounds/piano/G-sharp-4.ogg' },
  { note: 'A4', keyBinding: 'h', isBlack: false, audioPath: '/sounds/piano/A4.ogg' },
  { note: 'A#4', keyBinding: 'u', isBlack: true, audioPath: '/sounds/piano/A-sharp-4.ogg' },
  { note: 'B4', keyBinding: 'j', isBlack: false, audioPath: '/sounds/piano/B4.ogg' },
];

/**
 * Pre-defined melodies with note sequences.
 * Each note has: note name, duration in ms (how long to show as active)
 * null represents a rest/pause
 */
const MELODIES = [
  {
    id: 'mary-little-lamb',
    name: 'Mary Had a Little Lamb',
    tempo: 300, // ms per beat
    notes: [
      // "Ma-ry had a lit-tle lamb"
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 2 },
      // "lit-tle lamb"
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 2 },
      // "lit-tle lamb"
      { note: 'E4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 2 },
      // "Ma-ry had a lit-tle lamb"
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      // "whose fleece was white as snow"
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
  },
];

/**
 * Create a mapping from keyboard key to note
 */
const KEY_TO_NOTE_MAP = PIANO_KEYS.reduce((acc, key) => {
  acc[key.keyBinding.toLowerCase()] = key.note;
  return acc;
}, {});

/**
 * Minimalist Piano Component
 * 
 * Features:
 * - One octave (C4 to B4) with 7 white and 5 black keys
 * - Keyboard support (home row for white, top row for black keys)
 * - Click/touch support for mouse and mobile
 * - Sustain/loop while key is held with smooth release
 * - Polyphonic playback (multiple simultaneous notes)
 */
export default function Piano() {
  // Track which notes are currently active (for visual feedback)
  const [activeNotes, setActiveNotes] = useState(new Set());
  // Track which melody is currently playing
  const [playingMelody, setPlayingMelody] = useState(null);
  // Ref to track if we should cancel melody playback
  const melodyAbortRef = useRef(false);

  // Extract keyboard bindings for the key press hook
  const keyBindings = useMemo(
    () => PIANO_KEYS.map(key => key.keyBinding),
    []
  );

  // Initialize audio player with piano notes
  const { 
    playNote, 
    stopNote, 
    isLoaded, 
    loadError, 
    resumeContext 
  } = useAudioPlayer(PIANO_KEYS);

  /**
   * Start playing a note (called from keyboard or mouse/touch)
   */
  const handleNoteStart = useCallback((note) => {
    resumeContext(); // Ensure audio context is active
    playNote(note);
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.add(note);
      return next;
    });
  }, [playNote, resumeContext]);

  /**
   * Stop playing a note (called from keyboard or mouse/touch)
   */
  const handleNoteEnd = useCallback((note) => {
    stopNote(note);
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
  }, [stopNote]);

  /**
   * Handle keyboard key down - map to note and start
   */
  const handleKeyDown = useCallback((key) => {
    const note = KEY_TO_NOTE_MAP[key];
    if (note) {
      handleNoteStart(note);
    }
  }, [handleNoteStart]);

  /**
   * Handle keyboard key up - map to note and stop
   */
  const handleKeyUp = useCallback((key) => {
    const note = KEY_TO_NOTE_MAP[key];
    if (note) {
      handleNoteEnd(note);
    }
  }, [handleNoteEnd]);

  // Set up keyboard event handling
  useKeyPress(keyBindings, handleKeyDown, handleKeyUp);

  /**
   * Play a melody - sequence of notes with timing
   */
  const playMelody = useCallback(async (melody) => {
    if (playingMelody) return; // Already playing

    await resumeContext();
    setPlayingMelody(melody.id);
    melodyAbortRef.current = false;

    for (const noteData of melody.notes) {
      // Check if playback was aborted
      if (melodyAbortRef.current) break;

      if (noteData.note) {
        // Play the note and show visual feedback
        playNote(noteData.note);
        setActiveNotes(new Set([noteData.note]));
      }

      // Wait for the duration
      await new Promise(resolve => 
        setTimeout(resolve, noteData.duration * melody.tempo)
      );

      // Clear visual feedback
      setActiveNotes(new Set());
      
      // Small gap between notes
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setPlayingMelody(null);
  }, [playingMelody, playNote, resumeContext]);

  // Separate white and black keys for proper rendering order
  const whiteKeys = useMemo(
    () => PIANO_KEYS.filter(key => !key.isBlack),
    []
  );

  const blackKeys = useMemo(
    () => PIANO_KEYS.filter(key => key.isBlack),
    []
  );

  /**
   * Get the position for black keys (positioned between white keys)
   * Returns the left offset as a percentage based on white key index
   */
  const getBlackKeyPosition = useCallback((note) => {
    // Map black keys to their position relative to white keys
    const blackKeyPositions = {
      'C#4': 0,  // Between C and D
      'D#4': 1,  // Between D and E
      'F#4': 3,  // Between F and G
      'G#4': 4,  // Between G and A
      'A#4': 5,  // Between A and B
    };
    return blackKeyPositions[note];
  }, []);

  return (
    <div className="piano-container">
      <div className="piano" role="region" aria-label="Piano keyboard">
        {/* White keys layer */}
        <div className="piano__white-keys">
          {whiteKeys.map((key) => (
            <PianoKey
              key={key.note}
              note={key.note}
              keyBinding={key.keyBinding}
              isBlack={false}
              isActive={activeNotes.has(key.note)}
              onNoteStart={handleNoteStart}
              onNoteEnd={handleNoteEnd}
            />
          ))}
        </div>

        {/* Black keys layer (positioned absolutely) */}
        <div className="piano__black-keys">
          {blackKeys.map((key) => (
            <div
              key={key.note}
              className="piano__black-key-wrapper"
              style={{
                '--position': getBlackKeyPosition(key.note),
              }}
            >
              <PianoKey
                note={key.note}
                keyBinding={key.keyBinding}
                isBlack={true}
                isActive={activeNotes.has(key.note)}
                onNoteStart={handleNoteStart}
                onNoteEnd={handleNoteEnd}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Loading/error states */}
      {!isLoaded && !loadError && (
        <p className="piano__status">Loading piano sounds...</p>
      )}
      {loadError && (
        <p className="piano__status piano__status--error">
          Note: Some piano sounds could not be loaded. 
          Place audio files in /public/sounds/piano/
        </p>
      )}

      {/* Melody buttons */}
      <div className="piano__melodies">
        <p className="piano__melodies-label">Play a melody:</p>
        <div className="piano__melody-buttons">
          {MELODIES.map((melody) => (
            <MelodyButton
              key={melody.id}
              name={melody.name}
              isPlaying={playingMelody === melody.id}
              disabled={!isLoaded || (playingMelody && playingMelody !== melody.id)}
              onPlay={() => playMelody(melody)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <p className="piano__instructions">
        Use keyboard keys (A-J for white, W-E-T-Y-U for black) or click/tap keys
      </p>
    </div>
  );
}
