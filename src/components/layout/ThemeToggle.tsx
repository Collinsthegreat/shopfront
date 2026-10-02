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
        className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-text-tertiary"
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
      className="w-10 h-10 min-h-[40px] rounded-md border border-border bg-surface text-text-primary hover:bg-canvas transition-colors flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-text-primary" />
      ) : (
        <Moon className="w-4 h-4 text-text-primary" />
      )}
    </button>
  );
}
