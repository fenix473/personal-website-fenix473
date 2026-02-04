"use client";

import { getTodayPosition, getOrbitData, getTimeStepIndex } from "@/app/orbit/OrbitCalculation";
import { useState, useEffect, useMemo, useRef } from "react";
import OrbitSpace from "@/app/orbit/OrbitSpace";

/**
 * OrbitBackground - Background orbital visualization for the entire app
 * Displays Earth's orbit around the Sun as a fixed background element
 * Easter egg: Click Earth to animate through full orbit
 */
function OrbitBackground() {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [viewportWidth, setViewportWidth] = useState(600);
    const [viewportHeight, setViewportHeight] = useState(600);
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationIndex, setAnimationIndex] = useState(0);
    const [trail, setTrail] = useState([]);
    const originalPositionRef = useRef(null);
    const currentIndexRef = useRef(0);
    const animationFrameRef = useRef(null);

    const orbitData = useMemo(() => {
        try {
            const data = getOrbitData();
            console.log('OrbitBackground: Orbit data loaded', data?.length);
            return data;
        } catch (error) {
            console.error('OrbitBackground: Error loading orbit data', error);
            return null;
        }
    }, []);

    useEffect(() => {
        if (!orbitData) return;
        
        try {
            const startDate = new Date('2026-01-01T00:00:00Z');
            const position = getTodayPosition(orbitData, startDate);
            const currentIndex = getTimeStepIndex(new Date(), startDate);
            
            if (position) {
                console.log('OrbitBackground: Position calculated', position);
                setCurrentPosition(position);
                currentIndexRef.current = Math.max(0, Math.min(currentIndex, orbitData.length - 1));
                originalPositionRef.current = position;
            } else {
                console.warn('OrbitBackground: No position found');
            }
        } catch (error) {
            console.error('OrbitBackground: Error calculating position', error);
        }
      }, [orbitData]);

    useEffect(() => {
        const updateViewportSize = () => {
            setViewportWidth(window.innerWidth);
            setViewportHeight(window.innerHeight);
        };

        updateViewportSize();
        window.addEventListener('resize', updateViewportSize);
        
        return () => window.removeEventListener('resize', updateViewportSize);
    }, []);

    // Handle orbit animation
    useEffect(() => {
        if (!isAnimating || !orbitData || orbitData.length === 0) {
            return;
        }

        // Speed control: positions per frame (higher = faster)
        const positionsPerFrame = 3; // Update 3 positions per frame for faster animation
        let frameCounter = 0; // Track frames for trail sampling
        const startIndex = currentIndexRef.current; // Store starting index to complete full orbit
        let hasWrapped = false; // Track if we've wrapped around from end to beginning
        
        const animate = () => {
            setAnimationIndex((prevIndex) => {
                let nextIndex = prevIndex + positionsPerFrame;
                
                // Wrap around if we've reached the end of orbit data
                // This means: go from startIndex -> ... -> last index -> 0 -> ... -> startIndex
                if (nextIndex >= orbitData.length) {
                    nextIndex = nextIndex % orbitData.length;
                    hasWrapped = true; // Mark that we've wrapped around
                }
                
                // Check if we've completed a full orbit and returned to starting position
                // After wrapping around, we need to reach or pass the start index
                const hasCompletedOrbit = hasWrapped && nextIndex >= startIndex;
                
                if (hasCompletedOrbit) {
                    // Animation complete - we're back at the starting position
                    setIsAnimating(false);
                    frameCounter = 0;
                    hasWrapped = false; // Reset for next animation
                    // Set to exact starting position
                    const startPosition = orbitData[startIndex];
                    setCurrentPosition(startPosition);
                    console.log('Animation completed at starting position:', startIndex);
                    return startIndex;
                }
                
                // Update position
                const newPosition = orbitData[nextIndex];
                setCurrentPosition(newPosition);
                
                // Add to trail only occasionally to prevent accumulation
                // Add trail point every 5th frame to keep trail manageable
                frameCounter++;
                if (frameCounter % 5 === 0) {
                    setTrail((prevTrail) => {
                        const maxTrailLength = 15; // Keep only last 15 points (very short trail)
                        const newTrail = [...prevTrail, { x: newPosition.x, y: newPosition.y, timestamp: Date.now() }];
                        // Keep only the most recent points - oldest automatically removed
                        return newTrail.slice(-maxTrailLength);
                    });
                }
                
                return nextIndex;
            });
        };

        // Use requestAnimationFrame for smooth animation
        let isRunning = true;
        
        function frame() {
            if (!isRunning) return;
            
            animate();
            
            // Only schedule next frame if still running
            if (isRunning) {
                animationFrameRef.current = requestAnimationFrame(frame);
            }
        }
        
        animationFrameRef.current = requestAnimationFrame(frame);

        return () => {
            isRunning = false;
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isAnimating, orbitData]);

    // Handle return to original position when animation completes
    useEffect(() => {
        if (!isAnimating && originalPositionRef.current) {
            // Ensure we return to the exact original position
            // Use setTimeout to ensure state updates have completed
            const timeout = setTimeout(() => {
                if (originalPositionRef.current) {
                    setCurrentPosition(originalPositionRef.current);
                    console.log('Returned to original position:', originalPositionRef.current);
                }
            }, 0);
            
            return () => clearTimeout(timeout);
        }
    }, [isAnimating]);

    /**
     * Handle Earth click - start orbit animation from current position
     */
    const handleEarthClick = () => {
        if (!isAnimating && orbitData && orbitData.length > 0 && currentPosition) {
            // Store current position before starting animation - make a copy to ensure it's preserved
            originalPositionRef.current = { ...currentPosition };
            console.log('Stored original position:', originalPositionRef.current);
            // Clear any existing trail immediately
            setTrail([]);
            setIsAnimating(true);
            // Start from current index
            setAnimationIndex(currentIndexRef.current);
        }
    };
    
    // Clear trail when animation stops
    useEffect(() => {
        if (!isAnimating) {
            // Clear trail immediately when animation stops
            setTrail([]);
        }
    }, [isAnimating]);
    
    return (
        <div className="orbitBackground" style={{ pointerEvents: 'auto' }}>
            {currentPosition ? (
                <OrbitSpace 
                    x={currentPosition.x} 
                    y={currentPosition.y} 
                    width={viewportWidth} 
                    height={viewportHeight}
                    noBorder={true}
                    backgroundColor="transparent"
                    onEarthClick={handleEarthClick}
                    trail={trail}
                />
            ) : (
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'transparent' 
                }} />
            )}
        </div>
    );
}

export default OrbitBackground;
