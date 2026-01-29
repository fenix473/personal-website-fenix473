"use client";

import { getTodayPosition, getOrbitData } from "@/app/orbit/OrbitCalculation";
import { useState, useEffect, useMemo } from "react";
import OrbitSpace from "@/app/orbit/OrbitSpace";

/**
 * OrbitBackground - Background orbital visualization for the entire app
 * Displays Earth's orbit around the Sun as a fixed background element
 */
function OrbitBackground() {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [viewportWidth, setViewportWidth] = useState(600);
    const [viewportHeight, setViewportHeight] = useState(600);

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
            
            if (position) {
                console.log('OrbitBackground: Position calculated', position);
                setCurrentPosition(position);
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
    
    return (
        <div className="orbitBackground">
            {currentPosition ? (
                <OrbitSpace 
                    x={currentPosition.x} 
                    y={currentPosition.y} 
                    width={viewportWidth} 
                    height={viewportHeight}
                    noBorder={true}
                    backgroundColor="rgba(0, 0, 0, 0.3)"
                />
            ) : (
                <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    background: 'rgba(0, 0, 0, 0.1)' 
                }} />
            )}
        </div>
    );
}

export default OrbitBackground;
