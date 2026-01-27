'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for handling keyboard events for piano keys.
 * Tracks which keys are currently pressed and prevents key repeat on hold.
 * 
 * @param {Array} keyBindings - Array of valid key bindings to listen for
 * @param {Function} onKeyDown - Callback when a key is pressed
 * @param {Function} onKeyUp - Callback when a key is released
 * @returns {Set} - Set of currently pressed keys
 */
export default function useKeyPress(keyBindings, onKeyDown, onKeyUp) {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const pressedKeysRef = useRef(new Set());

  // Memoize the valid key set for quick lookups
  const validKeys = useRef(new Set(keyBindings.map(k => k.toLowerCase())));

  // Update valid keys when bindings change
  useEffect(() => {
    validKeys.current = new Set(keyBindings.map(k => k.toLowerCase()));
  }, [keyBindings]);

  /**
   * Handle keydown events - start sound if key is valid and not already pressed
   */
  const handleKeyDown = useCallback((event) => {
    // Ignore if user is typing in an input field
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );
    if (isTyping) return;

    // Ignore auto-repeated keydown events from holding key
    if (event.repeat) return;
    
    const key = event.key.toLowerCase();
    
    // Ignore if not a valid piano key
    if (!validKeys.current.has(key)) return;
    
    // Prevent key repeat - only trigger once per press
    if (pressedKeysRef.current.has(key)) return;
    
    // Prevent default browser behavior
    event.preventDefault();
    
    // Add to pressed keys
    pressedKeysRef.current.add(key);
    setPressedKeys(new Set(pressedKeysRef.current));
    
    // Trigger callback
    if (onKeyDown) {
      onKeyDown(key);
    }
  }, [onKeyDown]);

  /**
   * Handle keyup events - stop sound when key is released
   */
  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase();
    
    // Ignore if not a valid piano key
    if (!validKeys.current.has(key)) return;
    
    // Remove from pressed keys
    pressedKeysRef.current.delete(key);
    setPressedKeys(new Set(pressedKeysRef.current));
    
    // Trigger callback
    if (onKeyUp) {
      onKeyUp(key);
    }
  }, [onKeyUp]);

  /**
   * Handle window blur - release all keys when window loses focus
   */
  const handleBlur = useCallback(() => {
    // Release all pressed keys
    pressedKeysRef.current.forEach((key) => {
      if (onKeyUp) {
        onKeyUp(key);
      }
    });
    pressedKeysRef.current.clear();
    setPressedKeys(new Set());
  }, [onKeyUp]);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  return pressedKeys;
}
