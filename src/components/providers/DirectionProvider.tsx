"use client";

import { useSyncExternalStore } from "react";

interface DirectionProviderProps {
  children: React.ReactNode;
}

function getDirectionSnapshot(): "ltr" | "rtl" {
  if (typeof document === "undefined") return "ltr";
  
  const html = document.documentElement;
  const currentDir = html.getAttribute("dir") as "ltr" | "rtl" | null;
  if (currentDir) return currentDir;
  
  const lang = html.getAttribute("lang") || "en";
  return ["ar", "he", "fa", "ur"].includes(lang.substring(0, 2)) ? "rtl" : "ltr";
}

function subscribe(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  
  const html = document.documentElement;
  const observer = new MutationObserver(callback);
  observer.observe(html, { attributes: true, attributeFilter: ["dir", "lang"] });
  
  const handleLanguageChange = callback;
  window.addEventListener("languagechange", handleLanguageChange);
  
  return () => {
    observer.disconnect();
    window.removeEventListener("languagechange", handleLanguageChange);
  };
}

export function DirectionProvider({ children }: DirectionProviderProps) {
  const direction = useSyncExternalStore(subscribe, getDirectionSnapshot, getDirectionSnapshot);

  return (
    <div dir={direction} lang={direction === "rtl" ? "ar" : "en"}>
      {children}
    </div>
  );
}
