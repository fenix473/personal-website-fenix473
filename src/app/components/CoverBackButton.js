"use client";

import "./CoverBackButton.css";

/**
 * Back button with book cover as background
 * @param {string} coverImage - URL to the cover image
 * @param {function} onClick - Click handler
 */
function CoverBackButton({ coverImage, onClick }) {
    return (
        <button className="cover-back-button" onClick={onClick}>
            <img src={coverImage} alt="" className="cover-back-button-bg" />
            <div className="cover-back-button-overlay" />
            <span className="cover-back-button-text">← Back to list</span>
        </button>
    );
}

export default CoverBackButton;
