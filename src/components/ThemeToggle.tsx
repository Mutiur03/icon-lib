"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // Read theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const activeTheme = (savedTheme as "light" | "dark") || systemTheme;
    
    setTheme(activeTheme);
    if (activeTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  // Prevent render flash
  if (theme === null) {
    return (
      <div className="h-10 w-10 rounded-lg border border-slate-800 bg-slate-900" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center h-10 w-10 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <span
          className={`absolute transition-all duration-300 transform ${
            theme === "light" ? "translate-y-0 opacity-100 rotate-0" : "translate-y-6 opacity-0 rotate-45"
          }`}
        >
          <Sun size={20} className="text-amber-500" />
        </span>
        {/* Moon Icon */}
        <span
          className={`absolute transition-all duration-300 transform ${
            theme === "dark" ? "translate-y-0 opacity-100 rotate-0" : "-translate-y-6 opacity-0 -rotate-45"
          }`}
        >
          <Moon size={20} className="text-indigo-400" />
        </span>
      </div>
    </button>
  );
}
