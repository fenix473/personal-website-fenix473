"use client";

import { useEffect } from "react";

/**
 * Hook for infinite horizontal scroll carousel
 * @param {React.RefObject} scrollRef - Reference to the scroll container
 * @param {boolean} enabled - Whether the scroll should be active
 */
function useInfiniteScroll(scrollRef, enabled = true) {
    useEffect(() => {
        const container = scrollRef.current;
        if (!container || !enabled) return;

        // Start in the middle set
        const oneThird = container.scrollWidth / 3;
        container.scrollLeft = oneThird;

        function handleScroll() {
            const { scrollLeft, scrollWidth } = container;
            const third = scrollWidth / 3;

            // If scrolled to the last set, jump to middle
            if (scrollLeft >= third * 2) {
                container.scrollLeft = scrollLeft - third;
            }
            // If scrolled to the first set, jump to middle
            if (scrollLeft <= third * 0.1) {
                container.scrollLeft = scrollLeft + third;
            }
        }

        // Prevent browser back/forward gesture on horizontal scroll
        function handleWheel(e) {
            if (Math.abs(e.deltaX) > 0) {
                e.preventDefault();
                container.scrollLeft += e.deltaX;
            }
        }

        container.addEventListener("scroll", handleScroll);
        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            container.removeEventListener("scroll", handleScroll);
            container.removeEventListener("wheel", handleWheel);
        };
    }, [scrollRef, enabled]);
}

export default useInfiniteScroll;
