"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/providers";

export function ThemeToggle() {
  const { theme, toggleTheme } = useSite();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const light = theme === "light";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={ready ? light : undefined}
      aria-label={ready ? (light ? "Switch to dark theme" : "Switch to light theme") : "Toggle color theme"}
    >
      <span className="theme-icon" aria-hidden="true" />
    </button>
  );
}
