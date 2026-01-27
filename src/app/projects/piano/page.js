'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Piano from '../../components/Piano';
import CoverBackButton from '../../components/CoverBackButton';
import '../../css/PianoPage.css';

const FADE_OUT_MS = 420;

/**
 * Piano Project Page
 * Uses mounted state + CSS transitions so enter animation runs on client-side
 * navigation. prefetch={false} on the Piano link avoids prefetch reuse.
 */
export default function PianoPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      if (cancelled) return;
      setMounted(true);
    }, 50);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  const handleBack = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => router.push('/projects'), FADE_OUT_MS);
  }, [router, isExiting]);

  const show = mounted && !isExiting;

  return (
    <div className="piano-page" role="main">
        <div className="piano-page__bg piano-page__bg--base" aria-hidden="true" />

        <div
          className="piano-page__bg piano-page__bg--piano piano-page__transition"
          aria-hidden="true"
          style={{ opacity: show ? 1 : 0, transitionDuration: isExiting ? '0.35s' : '0.6s' }}
        />

        <div
          className="piano-page__foreground piano-page__transition"
          style={{
            opacity: show ? 1 : 0,
            pointerEvents: isExiting ? 'none' : 'auto',
            transitionDuration: isExiting ? '0.32s' : '0.5s',
            transitionDelay: isExiting ? '0s' : '0.15s',
          }}
        >
          <CoverBackButton onClick={handleBack} />
          <div className="piano-page__content">
            <h1 className="piano-page__title">Piano</h1>
            <Piano />
          </div>
        </div>
    </div>
  );
}
