"use client";

import { useState, useRef } from "react";
import WordReader from "@/utils/wordReader";
import useInfiniteScroll from "@/utils/useInfiniteScroll";
import CoverBackButton from "@/components/CoverBackButton";
import { essays } from "@/data/essays";

function Writings() {
    const [selectedEssay, setSelectedEssay] = useState(null);
    const [isOpening, setIsOpening] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showReader, setShowReader] = useState(false);
    const scrollRef = useRef(null);

    // Infinite scroll - disabled when essay is selected or transitioning
    useInfiniteScroll(scrollRef, !selectedEssay && !isClosing);

    function handleSelect(essay) {
        setSelectedEssay(essay);
        setIsOpening(true);
        
        // After fade out animation, show reader
        setTimeout(() => {
            setShowReader(true);
            setIsOpening(false);
        }, 600);
    }

    function handleBack() {
        setIsClosing(true);
        
        // First fade out reader
        setTimeout(() => {
            setShowReader(false);
        }, 400);

        // Then fade in carousel items
        setTimeout(() => {
            setIsClosing(false);
            setSelectedEssay(null);
        }, 800);
    }

    // Triple essays for infinite scroll effect
    const tripleEssays = [...essays, ...essays, ...essays];

    // Show reader view with animation
    if (showReader && selectedEssay) {
        return (
            <div className={`writings-reader docx-reader ${isClosing ? 'fade-out' : 'fade-in'}`}>
                <CoverBackButton 
                    coverImage={selectedEssay.cover} 
                    onClick={handleBack} 
                />
                <div className="reader-cover-container">
                    <img 
                        src={selectedEssay.cover} 
                        alt={selectedEssay.title} 
                        className="reader-cover"
                    />
                </div>
                <div className={`docx-container ${isClosing ? '' : 'fade-in-delayed'}`}>
                    <WordReader filePath={selectedEssay.file} />
                </div>
            </div>
        );
    }

    // Determine transition state
    const isTransitioning = isOpening || isClosing;

    // Show carousel (with transition state)
    return (
        <div className={`writings-section ${isTransitioning ? 'transitioning' : ''}`}>
            <div className="writings-section__card">
                <div className="carousel-container" ref={scrollRef}>
                    <div className="essays-track">
                    {tripleEssays.map((essay, index) => {
                        const isSelected = selectedEssay && essay.title === selectedEssay.title;
                        let cardClass = 'essay-card';
                        
                        if (isOpening) {
                            cardClass += isSelected ? ' selected' : ' fade-out';
                        } else if (isClosing) {
                            cardClass += isSelected ? ' selected-reverse' : ' fade-in';
                        }
                        
                        return (
                            <div
                                key={index}
                                className={cardClass}
                                onClick={() => !isTransitioning && handleSelect(essay)}
                            >
                                <img src={essay.cover} alt={essay.title} className="essay-card-cover" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Writings;
