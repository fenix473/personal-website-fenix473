'use client';

import { useMemo, useCallback, useState, useRef } from 'react';
import PianoKey from './PianoKey';
import MelodyButton, { SavedMelodyList } from './MelodyButton';
import useAudioPlayer from '../hooks/useAudioPlayer';
import useKeyPress from '../hooks/useKeyPress';
import '../css/Piano.css';

/**
 * Note names in chromatic order
 */
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_NOTES = new Set(['C#', 'D#', 'F#', 'G#', 'A#']);

/**
 * Keyboard mappings for all 4 octaves (C2 to C6)
 * Row 1 (1-0): C2-B2 (lowest octave)
 * Row Q (q-]): C3-B3 
 * Row A (a-'): C4-B4
 * Row Z (z-.): C5-B5 (highest octave)
 * C6 mapped to /
 */
const KEYBOARD_MAP = {
  // Octave 2 (number row) - white keys: 1,2,3,4,5,6,7 - black keys on shifted positions
  '1': 'C2', '!': 'C#2', '2': 'D2', '@': 'D#2', '3': 'E2',
  '4': 'F2', '$': 'F#2', '5': 'G2', '%': 'G#2', '6': 'A2', '^': 'A#2', '7': 'B2',
  // Octave 3 (Q row) - white keys: q,w,e,r,t,y,u - black keys: 9,0,-
  'q': 'C3', '8': 'C#3', 'w': 'D3', '9': 'D#3', 'e': 'E3',
  'r': 'F3', '0': 'F#3', 't': 'G3', '-': 'G#3', 'y': 'A3', '=': 'A#3', 'u': 'B3',
  // Octave 4 (A row) - white keys: a,s,d,f,g,h,j - black keys: i,o,p,[,]
  'a': 'C4', 'i': 'C#4', 's': 'D4', 'o': 'D#4', 'd': 'E4',
  'f': 'F4', 'p': 'F#4', 'g': 'G4', '[': 'G#4', 'h': 'A4', ']': 'A#4', 'j': 'B4',
  // Octave 5 (Z row) - white keys: z,x,c,v,b,n,m - black keys: k,l,;,'
  'z': 'C5', 'k': 'C#5', 'x': 'D5', 'l': 'D#5', 'c': 'E5',
  'v': 'F5', ';': 'F#5', 'b': 'G5', "'": 'G#5', 'n': 'A5', '\\': 'A#5', 'm': 'B5',
  // C6 (the final key)
  ',': 'C6',
};

/**
 * Generate 49 piano keys (C2 to C6 - 4 octaves + 1)
 */
function generatePianoKeys() {
  const keys = [];
  const startOctave = 2;
  const endOctave = 6;
  
  for (let octave = startOctave; octave <= endOctave; octave++) {
    const notesToAdd = octave === endOctave ? ['C'] : NOTE_NAMES;
    
    for (const noteName of notesToAdd) {
      const note = `${noteName}${octave}`;
      const isBlack = BLACK_NOTES.has(noteName);
      
      // Find keyboard binding if exists
      const keyBinding = Object.entries(KEYBOARD_MAP)
        .find(([, n]) => n === note)?.[0] || '';
      
      keys.push({
        note,
        keyBinding,
        isBlack,
      });
    }
  }
  
  return keys;
}

const PIANO_KEYS = generatePianoKeys();

/**
 * Pre-defined melodies with note sequences.
 * Each note has: note name, duration in ms
 * Duration: 1 = quarter note (400ms), 2 = half note (800ms)
 */
const MELODIES = [
  {
    id: 'mary-little-lamb',
    name: 'Mary Had a Little Lamb',
    tempo: 300,
    notes: [
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 2 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 2 },
      { note: 'E4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
  },
  {
    id: 'yellow-rose-texas',
    name: 'Yellow Rose of Texas',
    tempo: 400,
    notes: [
      { note: 'C4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'E4', duration: 2 },
      { note: 'C4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'C4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
  },
  {
    id: 'red-river-valley',
    name: 'Red River Valley',
    tempo: 400,
    notes: [
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'E4', duration: 2 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'E4', duration: 2 },
      { note: 'D4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
  },
  {
    id: 'home-on-range',
    name: 'Home on the Range',
    tempo: 400,
    notes: [
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'G4', duration: 1 },
      { note: 'A4', duration: 1 },
      { note: 'G4', duration: 2 },
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'F4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 2 },
    ],
  },
  {
    id: 'streets-of-laredo',
    name: 'Streets of Laredo',
    tempo: 400,
    notes: [
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 2 },
      { note: 'G4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'C4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
      { note: 'D4', duration: 1 },
      { note: 'E4', duration: 1 },
      { note: 'D4', duration: 1 },
      { note: 'C4', duration: 2 },
    ],
  },
];

/**
 * Create a mapping from keyboard key to note (use KEYBOARD_MAP directly)
 */
const KEY_TO_NOTE_MAP = KEYBOARD_MAP;

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
  // Playback id: each melody run gets an id; when we stop or switch, we bump it so the old run exits
  const playbackIdRef = useRef(0);
  
  // AI melody generation state
  const [melodyPrompt, setMelodyPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Extract keyboard bindings for the key press hook
  const keyBindings = useMemo(
    () => Object.keys(KEYBOARD_MAP),
    []
  );

  // Initialize audio player with synthesized sounds
  const { 
    playNote, 
    isLoaded, 
    loadError, 
    resumeContext,
    volume,
    setVolume,
  } = useAudioPlayer();

  /**
   * Handle volume slider change
   */
  const handleVolumeChange = useCallback((e) => {
    setVolume(parseFloat(e.target.value));
  }, [setVolume]);

  /**
   * Play a note (called from keyboard or click)
   * Shows brief visual feedback
   */
  const handleNoteStart = useCallback((note) => {
    resumeContext(); // Ensure audio context is active
    playNote(note);
    // Show visual feedback briefly
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.add(note);
      return next;
    });
    // Clear visual feedback after short delay
    setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 150);
  }, [playNote, resumeContext]);

  /**
   * Handle keyboard key down - map to note and play
   */
  const handleKeyDown = useCallback((key) => {
    const note = KEY_TO_NOTE_MAP[key];
    if (note) {
      handleNoteStart(note);
    }
  }, [handleNoteStart]);

  // Set up keyboard event handling (only keydown, no keyup needed)
  useKeyPress(keyBindings, handleKeyDown, null);

  /**
   * Stop the currently playing melody (bumps playback id so any running loop exits)
   */
  const stopMelody = useCallback(() => {
    playbackIdRef.current += 1;
    setActiveNotes(new Set());
    setPlayingMelody(null);
  }, []);

  /**
   * Play a melody - sequence of notes with timing.
   * If same melody is playing, stop it. If another is playing, stop it first then play this one.
   */
  const playMelody = useCallback(async (melody) => {
    if (playingMelody === melody.id) {
      stopMelody();
      return;
    }
    if (playingMelody) {
      stopMelody();
    }

    await resumeContext();
    const myId = playbackIdRef.current + 1;
    playbackIdRef.current = myId;
    setPlayingMelody(melody.id);

    for (const noteData of melody.notes) {
      if (myId !== playbackIdRef.current) break;

      if (noteData.note) {
        playNote(noteData.note);
        setActiveNotes(new Set([noteData.note]));
      }

      await new Promise(resolve =>
        setTimeout(resolve, noteData.duration * melody.tempo)
      );
      if (myId !== playbackIdRef.current) break;

      setActiveNotes(new Set());
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    if (myId === playbackIdRef.current) {
      setPlayingMelody(null);
    }
  }, [playingMelody, playNote, resumeContext, stopMelody]);

  /**
   * Generate a melody via N8N and save to Neon
   */
  const generateMelody = useCallback(async () => {
    if (!melodyPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Call N8N to generate melody
      const genResponse = await fetch('/api/piano/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: melodyPrompt }),
      });

      const data = await genResponse.json();

      // Check if N8N returned melody data
      if (data[0]?.melody?.notes) {
        const melody = data[0].melody;

        // Save to Neon database
        const saveResponse = await fetch('/api/piano/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: melody.name || melodyPrompt,
            tempo: melody.tempo || 300,
            notes: melody.notes,
          }),
        });

        if (saveResponse.ok) {
          const savedMelody = await saveResponse.json();
          // Add to saved melodies list via global function
          if (typeof window !== 'undefined' && window.__addSavedMelody) {
            window.__addSavedMelody(savedMelody);
          }
          // Play the new melody
          playMelody(savedMelody);
          // Clear input
          setMelodyPrompt('');
        } else {
          setGenerationError('Failed to save melody');
        }
      } else {
        setGenerationError(data[0]?.output || 'No melody generated');
      }
    } catch (error) {
      console.error('Error generating melody:', error);
      setGenerationError('Failed to generate melody');
    } finally {
      setIsGenerating(false);
    }
  }, [melodyPrompt, isGenerating, playMelody]);

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
   * Get the position index for black keys relative to white keys
   * Calculates based on octave and note position
   */
  const getBlackKeyPosition = useCallback((note) => {
    const match = note.match(/^([A-G]#?)(\d)$/);
    if (!match) return 0;
    
    const [, noteName, octave] = match;
    const octaveNum = parseInt(octave);
    const startOctave = 2;
    
    // Position within an octave (which white key it follows)
    const blackKeyOffsets = {
      'C#': 0, 'D#': 1, 'F#': 3, 'G#': 4, 'A#': 5
    };
    
    // Calculate total white keys before this octave
    const whiteKeysPerOctave = 7;
    const octavesFromStart = octaveNum - startOctave;
    const whiteKeysBefore = octavesFromStart * whiteKeysPerOctave;
    
    return whiteKeysBefore + blackKeyOffsets[noteName];
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

      {/* Volume slider */}
      <div className="piano__volume">
        <div className="piano__volume-slider-row">
          <input
            id="volume-slider"
            type="range"
            className="piano__volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
          <span className="piano__volume-value">{Math.round(volume * 100)}%</span>
        </div>
        <label className="piano__volume-label" htmlFor="volume-slider">
          Volume
        </label>
      </div>

      {/* AI Melody Generator */}
      <div className="piano__generator">
        <p className="piano__melodies-label">Generate a melody with AI:</p>
        <div className="piano__generator-input">
          <input
            type="text"
            className="piano__prompt-input"
            placeholder="e.g., play something happy"
            value={melodyPrompt}
            onChange={(e) => setMelodyPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generateMelody()}
            disabled={isGenerating || !isLoaded}
          />
          <button
            className="piano__generate-button"
            onClick={generateMelody}
            disabled={isGenerating || !isLoaded || !melodyPrompt.trim()}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {generationError && (
          <p className="piano__status piano__status--error">{generationError}</p>
        )}
      </div>

      {/* Saved melodies from database */}
      <SavedMelodyList
        playingMelodyId={playingMelody}
        disabled={!isLoaded}
        onPlay={playMelody}
      />

      {/* Pre-defined melody buttons */}
      <div className="piano__melodies">
        <p className="piano__melodies-label">Classic melodies:</p>
        <div className="piano__melody-buttons">
          {MELODIES.map((melody) => (
            <MelodyButton
              key={melody.id}
              name={melody.name}
              isPlaying={playingMelody === melody.id}
              disabled={!isLoaded}
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
