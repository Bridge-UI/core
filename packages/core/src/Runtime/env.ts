/**
 * Whether `window` exists (browser / jsdom). Safe to call during SSR.
 */
export function hasWindow(): boolean {
  return typeof window !== "undefined";
}

/**
 * Whether `document` exists (browser / jsdom). Safe to call during SSR.
 */
export function hasDocument(): boolean {
  return typeof document !== "undefined";
}

/**
 * Runs `callback` after the next paint (two animation frames) and returns a
 * cancel function. A single frame can fire before a just-inserted node is
 * painted, so a CSS transition started there has no start style and jumps
 * straight to its end. No-op during SSR.
 */
export function requestAfterNextPaint(callback: () => void): () => void {
  if (!hasWindow()) {
    return () => {};
  }

  let frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(callback);
  });

  return () => {
    cancelAnimationFrame(frame);
  };
}
