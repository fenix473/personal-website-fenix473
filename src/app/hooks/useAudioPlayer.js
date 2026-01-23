'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Custom hook for Web Audio API piano playback.
 * Handles audio loading, playback with sustain/loop on hold, and polyphonic support.
 * 
 * @param {Array} notes - Array of note objects with { note, audioPath }
 * @returns {Object} - { playNote, stopNote, isLoaded, resumeContext, setVolume, volume }
 */
export default function useAudioPlayer(notes) {
  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const audioBuffersRef = useRef(new Map());
  const activeSourcesRef = useRef(new Map());
  const gainNodesRef = useRef(new Map());
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [volume, setVolumeState] = useState(0.7);
  const notesRef = useRef(notes);

  // Keep notes ref updated
  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  /**
   * Initialize AudioContext and master gain node
   */
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      // Create master gain node for volume control
      masterGainRef.current = audioContextRef.current.createGain();
      masterGainRef.current.connect(audioContextRef.current.destination);
      masterGainRef.current.gain.setValueAtTime(0.7, audioContextRef.current.currentTime);
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

  /**
   * Load a single audio file into an AudioBuffer
   */
  const loadAudioBuffer = useCallback(async (audioPath, note, ctx) => {
    try {
      const response = await fetch(audioPath);
      if (!response.ok) {
        throw new Error(`Failed to load ${audioPath}: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      audioBuffersRef.current.set(note, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Could not load audio for ${note}:`, error.message);
      return null;
    }
  }, []);

  /**
   * Load all audio files on mount
   */
  useEffect(() => {
    let isMounted = true;

    const loadAllAudio = async () => {
      const ctx = initAudioContext();
      
      const loadPromises = notesRef.current.map(({ note, audioPath }) => 
        loadAudioBuffer(audioPath, note, ctx)
      );

      try {
        await Promise.all(loadPromises);
        if (isMounted) {
          setIsLoaded(true);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error);
        }
      }
    };

    if (notes && notes.length > 0) {
      loadAllAudio();
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      
      // Stop all active sources
      activeSourcesRef.current.forEach((source) => {
        try {
          source.stop();
        } catch (e) {
          // Ignore errors from already stopped sources
        }
      });
      activeSourcesRef.current.clear();
      gainNodesRef.current.clear();
      
      // Close audio context
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  /**
   * Play a note - plays once, can retrigger anytime
   */
  const playNote = useCallback(async (note) => {
    const ctx = await resumeContext();
    const buffer = audioBuffersRef.current.get(note);
    
    if (!buffer) {
      return;
    }

    // Stop any existing source for this note to allow retrigger
    if (activeSourcesRef.current.has(note)) {
      try {
        const existingSource = activeSourcesRef.current.get(note);
        existingSource.stop();
      } catch (e) {
        // Ignore
      }
    }

    // Create gain node for smooth release, connect through master gain
    const gainNode = ctx.createGain();
    gainNode.connect(masterGainRef.current);
    gainNode.gain.setValueAtTime(1, ctx.currentTime);

    // Create buffer source node
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = false; // Play once, no looping
    source.connect(gainNode);

    // Store references
    activeSourcesRef.current.set(note, source);
    gainNodesRef.current.set(note, gainNode);

    // Clean up when audio finishes naturally
    source.onended = () => {
      activeSourcesRef.current.delete(note);
      gainNodesRef.current.delete(note);
    };

    // Start playback
    source.start(0);
  }, [resumeContext]);

  /**
   * Stop a note with smooth release (fade out)
   */
  const stopNote = useCallback((note) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const source = activeSourcesRef.current.get(note);
    const gainNode = gainNodesRef.current.get(note);

    if (source && gainNode) {
      // Smooth release with exponential ramp (simulates piano release)
      const releaseTime = 0.3; // 300ms release
      const currentTime = ctx.currentTime;
      
      gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + releaseTime);

      // Stop the source after the fade out
      setTimeout(() => {
        try {
          source.stop();
        } catch (e) {
          // Source may already be stopped
        }
        activeSourcesRef.current.delete(note);
        gainNodesRef.current.delete(note);
      }, releaseTime * 1000);
    }
  }, []);

  /**
   * Stop all currently playing notes
   */
  const stopAllNotes = useCallback(() => {
    activeSourcesRef.current.forEach((_, note) => {
      stopNote(note);
    });
  }, [stopNote]);

  return {
    playNote,
    stopNote,
    stopAllNotes,
    isLoaded,
    loadError,
    resumeContext,
    volume,
    setVolume,
  };
}
