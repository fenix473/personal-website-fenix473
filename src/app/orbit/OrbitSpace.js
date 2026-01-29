/**
 * Minimal Coordinate Space for Orbital Display
 * Pass x, y coordinates to display Earth's position
 */

import { useEffect, useRef } from 'react';

export default function OrbitSpace({ x, y, width = 600, height = 600, noBorder = false, backgroundColor = '#000' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Center point
    const centerX = width / 2;
    const centerY = height / 2;

    // Scale factor (convert meters to pixels)
    // Earth orbit is ~150 million km, so we scale to fit canvas
    const scale = (width / 2 - 50) / 1.5e11;

    // Convert x, y to canvas coordinates
    const earthX = centerX + x * scale;
    const earthY = centerY + y * scale;

    // Draw Sun (center)
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();

    // Draw Earth
    ctx.fillStyle = '#00aaff';
    ctx.beginPath();
    ctx.arc(earthX, earthY, 8, 0, 2 * Math.PI);
    ctx.fill();

  }, [x, y, width, height, backgroundColor]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={noBorder ? {} : { border: '1px solid #333' }}
    />
  );
}
