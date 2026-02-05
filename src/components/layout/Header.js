"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/HeaderNav.css";

/**
 * Header - Fixed navigation with glass morphism.
 * Smooth-scrolls to sections on home; navigates normally elsewhere.
 */
function Header() {
  const pathname = usePathname();

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    if (pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showBack =
    pathname !== "/" && !pathname?.startsWith("/projects/assistant");

  return (
    <header className="header">
      <div className="header__container">
        <Link href="/" className="header__logo">
          Libero Favi
        </Link>

        <nav className="header__nav">
          <Link
            href="/#projects"
            className="header__link"
            onClick={(e) => scrollToSection(e, "projects")}
          >
            Projects
          </Link>
          <Link
            href="/projects/dashboard"
            className={`header__link ${isActive("/projects/dashboard") ? "header__link--active" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/#about"
            className="header__link"
            onClick={(e) => scrollToSection(e, "about")}
          >
            About
          </Link>
          <Link
            href="/#writings"
            className="header__link"
            onClick={(e) => scrollToSection(e, "writings")}
          >
            Writings
          </Link>
          <Link
            href="/#contact"
            className="header__link"
            onClick={(e) => scrollToSection(e, "contact")}
          >
            Contact
          </Link>
          {showBack && (
            <Link
              href="/"
              className="header__back"
              aria-label="Go to home"
            >
              ← Back
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
