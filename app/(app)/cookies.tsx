"use client";

import { useEffect, useState } from "react";

export const useCookie = (field: string) => {
  const [cookieValue, setCookieValue] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const getCookie = () => {
        console.log("Window available, checking cookies...");

        const cookieString = document.cookie;
        console.log("Raw cookies:", cookieString);

        const cookies = cookieString.split("; ").map((c) => c.split("="));
        console.log("Parsed cookies:", cookies);

        const foundCookie = cookies.find(([name]) => name === field);
        console.log("Found cookie:", foundCookie);

        const value = foundCookie ? foundCookie.slice(1).join("=") : null;
        setCookieValue(value);
      };

      getCookie(); // Read cookie on mount

      // ✅ Listen for browser navigation events to refresh the cookie
      window.addEventListener("popstate", getCookie);
      return () => window.removeEventListener("popstate", getCookie);
    }
  }, [field]); // Re-run if the field changes

  return cookieValue;
};
