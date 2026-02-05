"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/Header.css";

/**
 * Fixed header with back button linking to home.
 * Hidden on / and /projects/assistant.
 */
export default function HeaderBackButton() {
  const pathname = usePathname();
  if (pathname === "/" || pathname?.startsWith("/projects/assistant")) {
    return null;
  }

  return (
    <header className="header-back">
      <Link href="/" className="header-back__button" aria-label="Go to home">
        ← Back
      </Link>
    </header>
  );
}
