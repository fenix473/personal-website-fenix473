"use client";

import { useState, useEffect } from "react";
import { siteMeta } from "@/data/site-metadata";

/** Match typical phone/tablet width; below this we open PDF in new tab for native viewer (scroll + download). */
const MOBILE_BREAKPOINT_PX = 768;

function Resume() {
    const [showResume, setShowResume] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`);
        const update = () => setIsMobile(mql.matches);
        update();
        mql.addEventListener("change", update);
        return () => mql.removeEventListener("change", update);
    }, []);

    function handleClose() {
        setShowResume(false);
    }

    if (isMobile) {
        return (
            <div className="resume-section">
                <a
                    href={siteMeta.resumePdfPath}
                    className="resume-button"
                >
                    📄 View Resume
                </a>
            </div>
        );
    }

    if (showResume) {
        return (
            <div className="resume-viewer">
                <button className="resume-back-button" onClick={handleClose}>
                    ← Close Resume
                </button>
                <h2 className="resume-title">My Resume</h2>
                <div className="resume-pdf-container">
                    <iframe
                        src={siteMeta.resumePdfPath}
                        className="resume-pdf-iframe"
                        title="Resume PDF"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="resume-section">
            <button className="resume-button" onClick={() => setShowResume(true)}>
                📄 View Resume
            </button>
        </div>
    );
}

export default Resume;
