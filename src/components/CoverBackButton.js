"use client";

import "@/styles/CoverBackButton.css";

/**
 * Back button with optional book cover as background.
 * When coverImage is omitted, uses a gradient fallback.
 * @param {string} [coverImage] - URL to the cover image (optional)
 * @param {function} [onClick] - Click handler (required for navigation)
 */
function CoverBackButton({ coverImage, onClick }) {
    const className = [
        "cover-back-button",
        !coverImage ? "cover-back-button--no-cover" : "",
    ].filter(Boolean).join(" ");

    return (
        <button className={className} onClick={onClick} type="button">
            {coverImage && (
                <img src={coverImage} alt="" className="cover-back-button-bg" />
            )}
            <div className="cover-back-button-overlay" />
            <span className="cover-back-button-text">← Back to list</span>
        </button>
    );
}

export default CoverBackButton;
