import { useEffect, useState } from "react";

type Theme = "morning" | "afternoon" | "night";

export function useTimeBasedTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("afternoon");

  const getThemeByTime = (): Theme => {
    // Get time in Lagos, Nigeria timezone
    const lagosTime = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Africa/Lagos" })
    );
    const hour = lagosTime.getHours();

    // Morning: 6 AM - 12 PM (6-11)
    if (hour >= 6 && hour < 12) {
      return "morning";
    }
    // Afternoon: 12 PM - 6 PM (12-17)
    else if (hour >= 12 && hour < 18) {
      return "afternoon";
    }
    // Night: 6 PM - 6 AM (18-23, 0-5)
    else {
      return "night";
    }
  };

  useEffect(() => {
    // Set initial theme
    const theme = getThemeByTime();
    setCurrentTheme(theme);
    document.documentElement.classList.remove("morning", "afternoon", "night");
    document.documentElement.classList.add(theme);

    // Update theme every minute to catch transitions
    const interval = setInterval(() => {
      const newTheme = getThemeByTime();
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
        document.documentElement.classList.remove(
          "morning",
          "afternoon",
          "night"
        );
        document.documentElement.classList.add(newTheme);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentTheme]);

  return currentTheme;
}