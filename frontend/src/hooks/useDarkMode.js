import { useEffect, useState } from "react";

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("ai-interview-copilot-theme") === "dark");

  useEffect(() => {
    localStorage.setItem("ai-interview-copilot-theme", darkMode ? "dark" : "light");
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  return {
    darkMode,
    toggleDarkMode: () => setDarkMode((value) => !value)
  };
}