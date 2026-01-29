"use client";

import { getTodayPosition, getOrbitData } from "@/app/orbit/OrbitCalculation";
import { useState, useEffect, useMemo } from "react";
import OrbitSpace from "@/app/orbit/OrbitSpace";


function Orbit() {
    const [currentPosition, setCurrentPosition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewportWidth, setViewportWidth] = useState(600);
    const [viewportHeight, setViewportHeight] = useState(600);

    const orbitData = useMemo(() => {
        console.log("Calculating orbit data...");
        const data = getOrbitData();
        console.log(`Calculated ${data.length} positions.`);
        return data;
    }, []);

    useEffect(() => {
        const startDate = new Date('2026-01-01T00:00:00Z');
        const position = getTodayPosition(orbitData, startDate);
        
        if (position) {
          setCurrentPosition(position);
        }
        setLoading(false);
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
        <div>
            <h1>Orbit</h1>
            {loading ? (
                <p>Loading...</p>
            ) : currentPosition ? (
                <>
                    <p>X: {currentPosition.x}</p>
                    <p>Y: {currentPosition.y}</p>
                    <p>VX: {currentPosition.vx}</p>
                    <p>VY: {currentPosition.vy}</p>
                    <OrbitSpace x={currentPosition.x} y={currentPosition.y} width={viewportWidth} height={viewportHeight} />
                </>
            ) : (
                <p>Position data not available</p>
            )}
        </div>
    );
}

export default Orbit;