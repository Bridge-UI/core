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
