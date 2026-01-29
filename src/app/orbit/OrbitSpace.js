/**
 * Minimal Coordinate Space for Orbital Display
 * Pass x, y coordinates to display Earth's position
 */

import { useEffect, useRef, useState } from 'react';

export default function OrbitSpace({ x, y, width = 600, height = 600, noBorder = false, backgroundColor = '#000' }) {
  const canvasRef = useRef(null);
  const [earthImage, setEarthImage] = useState(null);
  const [sunImage, setSunImage] = useState(null);

  // Load Earth image
  useEffect(() => {
    const img = new Image();
    img.src = '/images/Earth.png';
    img.onload = () => {
      setEarthImage(img);
    };
    img.onerror = () => {
      console.error('Failed to load Earth image');
    };
  }, []);

  // Load Sun image
  useEffect(() => {
    const img = new Image();
    img.src = '/images/sun_cartoon.png';
    img.onload = () => {
      setSunImage(img);
    };
    img.onerror = () => {
      console.error('Failed to load Sun image');
    };
  }, []);

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
    if (sunImage) {
      const sunSize = 160; // Size of Sun image in pixels
      ctx.drawImage(
        sunImage,
        centerX - sunSize / 2,
        centerY - sunSize / 2,
        sunSize,
        sunSize
      );
    } else {
      // Fallback to yellow circle if image not loaded yet
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw Earth image
    if (earthImage) {
      const earthSize = 40; // Size of Earth image in pixels
      ctx.drawImage(
        earthImage,
        earthX - earthSize / 2,
        earthY - earthSize / 2,
        earthSize,
        earthSize
      );
    } else {
      // Fallback to blue circle if image not loaded yet
      ctx.fillStyle = '#00aaff';
      ctx.beginPath();
      ctx.arc(earthX, earthY, 20, 0, 2 * Math.PI);
      ctx.fill();
    }

  }, [x, y, width, height, backgroundColor, earthImage, sunImage]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={noBorder ? {} : { border: '1px solid #333' }}
    />
  );
}
