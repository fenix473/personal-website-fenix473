"use client";

import { useState } from "react";
import { siteMeta } from "@/data/site-metadata";

function Resume() {
    const [showResume, setShowResume] = useState(false);

    function handleClose() {
        setShowResume(false);
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
