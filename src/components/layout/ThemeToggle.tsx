"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle(): React.JSX.Element {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center text-text-tertiary"
        aria-hidden="true"
      >
        <span className="w-4 h-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border bg-surface text-text-primary hover:border-accent hover:bg-canvas transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent shadow-sm"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-accent transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-text-primary transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
