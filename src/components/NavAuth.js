"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import "@/styles/Nav.css";

export default function NavAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <span className="navbar__auth navbar__auth--loading" aria-hidden>
        ·
      </span>
    );
  }

  if (user) {
    return (
      <span
        className="navbar__auth navbar__auth--logged-in"
        title="Signed in"
        aria-label="Signed in"
      >
        <FaCheckCircle />
      </span>
    );
  }

  return (
    <Link href="/auth/signin" className="navbar__auth-link">
      Sign In
    </Link>
  );
}
