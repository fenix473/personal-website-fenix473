'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Note frequency map - converts note names to frequencies in Hz.
 * Uses A4 = 440Hz as reference.
 */
const NOTE_FREQUENCIES = {
  'C': 16.35, 'C#': 17.32, 'D': 18.35, 'D#': 19.45, 'E': 20.60,
  'F': 21.83, 'F#': 23.12, 'G': 24.50, 'G#': 25.96, 'A': 27.50,
  'A#': 29.14, 'B': 30.87,
};

/**
 * Get frequency for a note (e.g., "C4", "F#5")
 */
function getNoteFrequency(note) {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 440;
  
  const [, noteName, octave] = match;
  const baseFreq = NOTE_FREQUENCIES[noteName];
  return baseFreq * Math.pow(2, parseInt(octave));
}

/**
 * Custom hook for synthesized piano sounds using Web Audio API.
 * Creates piano-like tones using oscillators with ADSR envelope.
 * Uses a compressor to prevent volume scaling with multiple notes.
 * 
 * @returns {Object} - { playNote, stopNote, isLoaded, resumeContext, setVolume, volume }
 */
export default function useAudioPlayer() {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const compressorRef = useRef(null);
  const activeNotesRef = useRef(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  /**
   * Initialize AudioContext with compressor to prevent volume scaling
   */
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create compressor to prevent volume from increasing with more notes
      compressorRef.current = audioContextRef.current.createDynamicsCompressor();
      compressorRef.current.threshold.setValueAtTime(-24, audioContextRef.current.currentTime);
      compressorRef.current.knee.setValueAtTime(30, audioContextRef.current.currentTime);
      compressorRef.current.ratio.setValueAtTime(12, audioContextRef.current.currentTime);
      compressorRef.current.attack.setValueAtTime(0.003, audioContextRef.current.currentTime);
      compressorRef.current.release.setValueAtTime(0.25, audioContextRef.current.currentTime);
      
      // Master gain for volume control
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.gain.setValueAtTime(0.7, audioContextRef.current.currentTime);
      
      // Chain: notes -> masterGain -> compressor -> destination
      masterGainRef.current.connect(compressorRef.current);
      compressorRef.current.connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, []);

  /**
   * Set the master volume (0-1)
   */
  const setVolume = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.setValueAtTime(clampedVolume, audioContextRef.current.currentTime);
    }
  }, []);

  /**
   * Resume AudioContext if suspended (browser autoplay policy)
   */
  const resumeContext = useCallback(async () => {
    const ctx = initAudioContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (error) {
        console.error('Failed to resume AudioContext:', error);
      }
    }
    return ctx;
  }, [initAudioContext]);

  // Mark as loaded on mount (no files to load for synthesis)
  useEffect(() => {
    initAudioContext();
    setIsLoaded(true);

    return () => {
      // Stop all active notes
      activeNotesRef.current.forEach((noteData) => {
        try {
          noteData.oscillators.forEach(osc => osc.stop());
        } catch (e) {
          // Ignore
        }
      });
      activeNotesRef.current.clear();
      
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [initAudioContext]);

  /**
   * Create a piano-like sound using multiple oscillators with automatic fade out
   */
  const playNote = useCallback(async (note) => {
    const ctx = await resumeContext();
    const frequency = getNoteFrequency(note);
    const currentTime = ctx.currentTime;

    // Stop existing note if playing (with quick fade)
    if (activeNotesRef.current.has(note)) {
      const existing = activeNotesRef.current.get(note);
      if (existing.timeout) clearTimeout(existing.timeout);
      // Quick fade out existing note
      try {
        existing.gainNode.gain.cancelScheduledValues(currentTime);
        existing.gainNode.gain.setValueAtTime(existing.gainNode.gain.value, currentTime);
        existing.gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.05);
      } catch (e) {}
      // Stop oscillators after fade
      setTimeout(() => {
        existing.oscillators.forEach(osc => {
          try { osc.stop(); } catch (e) {}
        });
      }, 60);
      activeNotesRef.current.delete(note);
    }

    // Create gain node for this note's envelope
    const noteGain = ctx.createGain();
    noteGain.connect(masterGainRef.current);

    // ADSR Envelope with full decay (piano-like with automatic fade out)
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainTime = 0.8;  // How long to sustain before release
    const releaseTime = 1.0;  // Fade out duration
    const peakLevel = 0.25;
    const sustainLevel = 0.12;
    const totalDuration = attackTime + decayTime + sustainTime + releaseTime;

    // Attack
    noteGain.gain.setValueAtTime(0, currentTime);
    noteGain.gain.linearRampToValueAtTime(peakLevel, currentTime + attackTime);
    // Decay to sustain
    noteGain.gain.exponentialRampToValueAtTime(sustainLevel, currentTime + attackTime + decayTime);
    // Release (fade out)
    noteGain.gain.exponentialRampToValueAtTime(0.001, currentTime + attackTime + decayTime + sustainTime + releaseTime);

    const oscillators = [];

    // Main oscillator - triangle wave for softer tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, currentTime);
    
    // Second oscillator - sine wave, one octave up for brightness
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, currentTime);
    
    // Third oscillator - sine at fundamental for body
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(frequency, currentTime);

    // Individual gain nodes for mixing oscillators
    const osc1Gain = ctx.createGain();
    const osc2Gain = ctx.createGain();
    const osc3Gain = ctx.createGain();

    osc1Gain.gain.setValueAtTime(0.4, currentTime);
    osc2Gain.gain.setValueAtTime(0.1, currentTime);
    osc3Gain.gain.setValueAtTime(0.3, currentTime);

    osc1.connect(osc1Gain);
    osc2.connect(osc2Gain);
    osc3.connect(osc3Gain);

    osc1Gain.connect(noteGain);
    osc2Gain.connect(noteGain);
    osc3Gain.connect(noteGain);

    // Start oscillators
    osc1.start(currentTime);
    osc2.start(currentTime);
    osc3.start(currentTime);

    // Schedule oscillators to stop after the envelope completes
    const stopTime = currentTime + totalDuration + 0.1;
    osc1.stop(stopTime);
    osc2.stop(stopTime);
    osc3.stop(stopTime);

    oscillators.push(osc1, osc2, osc3);

    // Store active note data
    activeNotesRef.current.set(note, {
      oscillators,
      gainNode: noteGain,
      oscGains: [osc1Gain, osc2Gain, osc3Gain],
    });

    // Clean up reference after note finishes
    const cleanupTimeout = setTimeout(() => {
      activeNotesRef.current.delete(note);
    }, totalDuration * 1000 + 150);

    activeNotesRef.current.get(note).timeout = cleanupTimeout;
  }, [resumeContext]);

  /**
   * Internal stop function
   */
  const stopNoteInternal = useCallback((note, ctx) => {
    const noteData = activeNotesRef.current.get(note);
    if (!noteData) return;

    const { oscillators, gainNode, timeout } = noteData;
    const currentTime = ctx.currentTime;
    const releaseTime = 0.5;

    if (timeout) clearTimeout(timeout);

    // Release envelope
    gainNode.gain.cancelScheduledValues(currentTime);
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + releaseTime);

    // Stop oscillators after release
    setTimeout(() => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      activeNotesRef.current.delete(note);
    }, releaseTime * 1000);
  }, []);

  /**
   * Stop a note with smooth release
   */
  const stopNote = useCallback((note) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    stopNoteInternal(note, ctx);
  }, [stopNoteInternal]);

  /**
   * Stop all currently playing notes
   */
  const stopAllNotes = useCallback(() => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    activeNotesRef.current.forEach((_, note) => {
      stopNoteInternal(note, ctx);
    });
  }, [stopNoteInternal]);

  return {
    playNote,
    stopNote,
    stopAllNotes,
    isLoaded,
    loadError: null,
    resumeContext,
    volume,
    setVolume,
  };
}
