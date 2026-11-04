import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

// A client navigation replaces history state without firing `popstate`, so the
// snapshot is a fresh string each read and React re-checks it on every commit.
const getSnapshot = () => window.location.pathname;
const getServerSnapshot = () => "/";

// Unlike usePathname(), this yields the real path during the very first
// hydration render, so server-rendered chrome matches what the browser shows.
export function usePagePathname() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
