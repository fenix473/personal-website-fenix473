"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Splits text into words and animates each word with a "pop" effect when
 * the container scrolls into view. Uses Intersection Observer.
 *
 * @param {string} text - The text to split and animate
 * @param {string} className - Optional CSS class for the wrapper
 * @param {number} staggerMs - Delay between each word's animation start (ms)
 * @param {number} threshold - Intersection Observer threshold (0-1)
 */
export default function PopInWords({ text, className = "", staggerMs = 40, threshold = 0.2 }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          {i > 0 && " "}
          <span
            className={`pop-in-word ${isVisible ? "pop-in-word--visible" : ""}`}
            style={{
              animationDelay: isVisible ? `${i * staggerMs}ms` : "0ms",
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
