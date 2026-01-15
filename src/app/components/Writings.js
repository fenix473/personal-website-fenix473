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

// PDFs served from public folder
const baseUrl = "/writings/";

// Essay collection with titles and files
const essays = [
    { title: "Orange Man", file: baseUrl + "Orange Man.pdf", description: "Reflection on the Charge of the Light Brigade by Tennyson. Exploring the topics of discipline, loyalty and officer responsibility." },
    { title: "Subjugation of Nature", file: baseUrl + "Subjugation of Nature.pdf", description: "Explration of the conflict between human and nature in the context of the Enlightenment and Romanticism." },
    { title: "Professional Writing", file: baseUrl + "Editable ENG II_ Initial.pdf", description: "A reflection on what it means to be a professional." },
    { title: "Research Essay", file: baseUrl + "Copy of Research Essay.pdf", description: "A research essay on work ethics." }
];

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

function Writings() {
    const [numPages, setNumPages] = useState(null);
    const [selectedEssay, setSelectedEssay] = useState(null);
    const pdfWidth = usePdfWidth();
    usePdfWorker();

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function handleBack() {
        setSelectedEssay(null);
        setNumPages(null);
    }

    // Show essay selection if none selected
    if (!selectedEssay) {
        return (
            <div className="writings-section">
                <h1 className="writings-title">Writings</h1>
                <p className="writings-subtitle">A collection of essays and reflections</p>
                <div className="essays-grid">
                    {essays.map((essay, index) => (
                        <div
                            key={index}
                            className="essay-card"
                            onClick={() => setSelectedEssay(essay)}
                        >
                            <h3 className="essay-card-title">{essay.title}</h3>
                            <p className="essay-card-description">{essay.description}</p>
                            <span className="essay-card-link">Read essay →</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Show selected essay
    return (
        <div className="writings-reader">
            <h1 className="writings-reader-title">Writings</h1>
            <button className="back-button" onClick={handleBack}>
                ← Back to list
            </button>
            <h2 className="essay-title">{selectedEssay.title}</h2>
            <div className="pdf-container">
                <Document file={selectedEssay.file} onLoadSuccess={onDocumentLoadSuccess}>
                    {numPages && Array.from({ length: numPages }, (_, index) => (
                        <Page key={index + 1} pageNumber={index + 1} width={pdfWidth} />
                    ))}
                </Document>
            </div>
            <p className="page-count">{numPages} pages</p>
        </div>
    );
}

export default Writings;
