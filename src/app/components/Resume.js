"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import react-pdf to avoid SSR issues
const Document = dynamic(
    () => import("react-pdf").then((mod) => mod.Document),
    { ssr: false }
);
const Page = dynamic(
    () => import("react-pdf").then((mod) => mod.Page),
    { ssr: false }
);

const resumePdf = "/CV.pdf";

// Hook to get responsive PDF width
function usePdfWidth() {
    const [width, setWidth] = useState(600);

    useEffect(() => {
        function handleResize() {
            setWidth(Math.min(600, window.innerWidth - 40));
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}

// Setup PDF.js worker on client side
function usePdfWorker() {
    useEffect(() => {
        import("react-pdf").then((pdfModule) => {
            pdfModule.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfModule.pdfjs.version}/build/pdf.worker.min.mjs`;
        });
    }, []);
}

function Resume() {
    const [showResume, setShowResume] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const pdfWidth = usePdfWidth();
    usePdfWorker();

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function handleClose() {
        setShowResume(false);
        setNumPages(null);
    }

    // Show resume PDF viewer
    if (showResume) {
        return (
            <div className="resume-viewer">
                <button className="resume-back-button" onClick={handleClose}>
                    ← Close Resume
                </button>
                <h2 className="resume-title">My Resume</h2>
                <div className="resume-pdf-container">
                    <Document file={resumePdf} onLoadSuccess={onDocumentLoadSuccess}>
                        {numPages && Array.from({ length: numPages }, (_, index) => (
                            <Page key={index + 1} pageNumber={index + 1} width={pdfWidth} />
                        ))}
                    </Document>
                </div>
                {numPages && <p className="resume-page-count">{numPages} page{numPages > 1 ? 's' : ''}</p>}
            </div>
        );
    }

    // Show button
    return (
        <div className="resume-section">
            <button
                className="resume-button"
                onClick={() => setShowResume(true)}
            >
                📄 View Resume
            </button>
        </div>
    );
}

export default Resume;
