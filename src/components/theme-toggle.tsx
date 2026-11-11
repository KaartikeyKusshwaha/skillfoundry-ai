"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  function systemChanged() {
    try { if (localStorage.getItem("site-theme")) return; } catch {}
    document.documentElement.dataset.theme = media.matches ? "dark" : "light";
    callback();
  }
  function storageChanged(event: StorageEvent) {
    if (event.key !== "site-theme") return;
    document.documentElement.dataset.theme = event.newValue === "dark" || (!event.newValue && media.matches) ? "dark" : "light";
    callback();
  }
  window.addEventListener("theme-change", callback);
  window.addEventListener("storage", storageChanged);
  media.addEventListener("change", systemChanged);
  return () => {
    window.removeEventListener("theme-change", callback);
    window.removeEventListener("storage", storageChanged);
    media.removeEventListener("change", systemChanged);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme === "dark", () => false);
  function toggle() {
    const theme = dark ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("site-theme", theme); } catch {}
    window.dispatchEvent(new Event("theme-change"));
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} title={`Switch to ${dark ? "light" : "dark"} mode`}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}
