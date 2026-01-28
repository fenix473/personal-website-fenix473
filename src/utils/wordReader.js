"use client";

import { useState, useEffect } from "react";
import mammoth from "mammoth";

/**
 * WordReader component - renders a DOCX file as HTML
 * @param {string} filePath - Path to the DOCX file (relative to public folder)
 */
function WordReader({ filePath }) {
    const [html, setHtml] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadDocx() {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch the DOCX file as array buffer
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Failed to load document: ${response.statusText}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                
                // Convert DOCX to HTML using mammoth
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setHtml(result.value);
                
                if (result.messages.length > 0) {
                    console.warn("Mammoth conversion messages:", result.messages);
                }
            } catch (err) {
                console.error("Error loading DOCX:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        if (filePath) {
            loadDocx();
        }
    }, [filePath]);

    if (loading) {
        return <div className="docx-loading">Loading document...</div>;
    }

    if (error) {
        return <div className="docx-error">Error: {error}</div>;
    }

    return (
        <div 
            className="docx-content"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default WordReader;
