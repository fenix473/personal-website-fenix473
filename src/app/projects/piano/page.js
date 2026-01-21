'use client';

import Piano from '../../components/Piano';
import CoverBackButton from '../../components/CoverBackButton';

/**
 * Piano Project Page
 * Displays the interactive piano component
 */
export default function PianoPage() {
  return (
    <div className="piano-page">
      <CoverBackButton />
      <div className="piano-page__content">
        <h1 className="piano-page__title">Piano</h1>
        <Piano />
      </div>

      <style jsx>{`
        .piano-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
          padding: 2rem;
        }

        .piano-page__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 3rem;
        }

        .piano-page__title {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 2rem;
          font-weight: 300;
          color: #fff;
          margin-bottom: 2rem;
          letter-spacing: 0.1em;
        }
      `}</style>
    </div>
  );
}
