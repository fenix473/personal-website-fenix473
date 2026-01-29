/**
 * Minimal Coordinate Space for Orbital Display
 * Pass x, y coordinates to display Earth's position
 */

import { useEffect, useRef, useState } from 'react';

export default function OrbitSpace({ x, y, width = 600, height = 600, noBorder = false, backgroundColor = '#000', onEarthClick, trail = [] }) {
  const canvasRef = useRef(null);
  const [earthImage, setEarthImage] = useState(null);
  const [sunImage, setSunImage] = useState(null);
  const earthBoundsRef = useRef({ x: 0, y: 0, size: 40 });

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

  // Store trail in ref so animation loop can access current value
  const trailRef = useRef(trail);
  useEffect(() => {
    trailRef.current = trail;
  }, [trail]);
  
  // Draw function that can be called repeatedly for fade animation
  const drawCanvas = useRef(() => {});
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawCanvas.current = () => {
      const ctx = canvas.getContext('2d');
      
      // Clear canvas completely - this is critical to prevent accumulation
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      // Center point
      const centerX = width / 2;
      const centerY = height / 2;

      // Scale factor (convert meters to pixels)
      // Earth orbit is elliptical: perihelion ~147M km, aphelion ~152M km
      // Use 1.6e11 to ensure all positions stay visible with margin
      const scale = (Math.min(width, height) / 2 - 60) / 1.6e11;

      // Convert x, y to canvas coordinates
      const earthX = centerX + x * scale;
      const earthY = centerY + y * scale;

      // Store Earth bounds for click detection
      const earthSize = 40;
      earthBoundsRef.current = {
        x: earthX - earthSize / 2,
        y: earthY - earthSize / 2,
        size: earthSize
      };

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

      // Draw trail - use trailRef to get current value
      // Trail points are already filtered by age, so just draw them all
      const currentTrail = trailRef.current;
      if (currentTrail && currentTrail.length > 0) {
        ctx.strokeStyle = '#00aaff';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.6; // Fixed opacity for trail
        
        // Draw trail segments
        for (let i = 0; i < currentTrail.length - 1; i++) {
          const point1 = currentTrail[i];
          const point2 = currentTrail[i + 1];
          
          const trailX1 = centerX + point1.x * scale;
          const trailY1 = centerY + point1.y * scale;
          const trailX2 = centerX + point2.x * scale;
          const trailY2 = centerY + point2.y * scale;
          
          ctx.beginPath();
          ctx.moveTo(trailX1, trailY1);
          ctx.lineTo(trailX2, trailY2);
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0; // Reset alpha
      }

      // Draw Earth image
      if (earthImage) {
        ctx.drawImage(
          earthImage,
          earthBoundsRef.current.x,
          earthBoundsRef.current.y,
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
    };

    // Initial draw
    drawCanvas.current();
  }, [x, y, width, height, backgroundColor, earthImage, sunImage]);

  // Continuous animation loop for trail updates
  useEffect(() => {
    let animationFrameId;
    let isRunning = true;
    
    const animate = () => {
      if (!isRunning) return;
      
      // Draw canvas to show trail updates
      drawCanvas.current();
      
      // Check if trail still has points
      const currentTrail = trailRef.current;
      if (currentTrail && currentTrail.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Trail is empty, stop animation
        isRunning = false;
      }
    };

    // Start animation if there's a trail
    if (trail.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      // Draw once to clear any remaining trail
      drawCanvas.current();
    }

    return () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [trail.length]);

  // Handle click detection and hover
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    
    if (!onEarthClick) {
      return;
    }

    const isOverEarth = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      // Recalculate Earth position based on current x, y props
      // Use the SAME scale calculation as drawing
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = (Math.min(width, height) / 2 - 60) / 1.6e11;
      const earthX = centerX + x * scale;
      const earthY = centerY + y * scale;
      const earthSize = 40;
      
      const earthLeft = earthX - earthSize / 2;
      const earthTop = earthY - earthSize / 2;

      const isOver = (
        clickX >= earthLeft &&
        clickX <= earthLeft + earthSize &&
        clickY >= earthTop &&
        clickY <= earthTop + earthSize
      );
      
      return isOver;
    };

    // Handle clicks on document level to bypass z-index issues
    const handleDocumentClick = (e) => {
      if (isOverEarth(e.clientX, e.clientY)) {
        console.log('Earth clicked!');
        e.preventDefault();
        e.stopPropagation();
        onEarthClick();
        return false;
      }
    };

    const handleMouseMove = (e) => {
      if (isOverEarth(e.clientX, e.clientY)) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    // Listen on document to catch clicks even when canvas is behind other elements
    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'default';
    };
  }, [onEarthClick, x, y, width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={{
        ...(noBorder ? {} : { border: '1px solid #333' }),
        ...(onEarthClick ? { pointerEvents: 'auto' } : {})
      }}
    />
  );
}
