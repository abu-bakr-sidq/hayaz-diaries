import { useSyncExternalStore } from "react";

// Tiny store that flips once the preloader has lifted, so the cover can
// start its entrance exactly as the curtain clears.
let done = false;
const listeners = new Set<() => void>();

export function finishIntro() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroDone() {
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false,
  );
}
