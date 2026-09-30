// ** External Imports
import { isNil } from "es-toolkit/compat";

// ** Local Imports
import type { ChartRenderTheme } from "@/Domain/chart";
import { hasDocument, hasWindow } from "@/Runtime/env";

/**
 * Probe classes for chart chrome colors (text color utilities).
 */
export type ChartThemeProbeClasses = {
  /**
   * Axis line color classes.
   */
  axis: string;

  /**
   * Grid line color classes.
   */
  grid: string;

  /**
   * Axis label color classes.
   */
  text: string;
};

let normalizeCanvas: null | undefined | CanvasRenderingContext2D;

/**
 * Lazily creates a 1×1 canvas used to convert any CSS color space to sRGB.
 */
function getNormalizeContext(): null | CanvasRenderingContext2D {
  if (normalizeCanvas !== undefined) {
    return normalizeCanvas;
  }

  if (!hasDocument()) {
    normalizeCanvas = null;
    return null;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    normalizeCanvas = canvas.getContext("2d", { willReadFrequently: true });
  } catch {
    normalizeCanvas = null;
  }

  return normalizeCanvas ?? null;
}

/**
 * Converts any CSS color (`oklch()`, `color-mix()`, …) to `rgba()` so
 * engines that only parse sRGB can use it. Returns `color` unchanged
 * when canvas is unavailable (SSR / test DOMs).
 */
export function normalizeCssColor(color: string): string {
  const context = getNormalizeContext();

  if (isNil(context) || color.length === 0) {
    return color;
  }

  try {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);

    const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data;

    return `rgba(${red}, ${green}, ${blue}, ${Math.round((alpha / 255) * 1000) / 1000})`;
  } catch {
    return color;
  }
}

/**
 * Reads the computed text color for `className` (e.g. `"text-primary-500
 * dark:text-primary-400"`) or a raw CSS `color` inside `container`, so
 * theme variables and dark mode resolve like regular markup.
 */
export function readCssColor(
  container: HTMLElement,
  { color, className }: { className?: string; color?: string },
): string {
  if (!hasWindow()) {
    return color ?? "";
  }

  const probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";

  if (!isNil(className)) {
    probe.className = className;
  }

  if (!isNil(color)) {
    probe.style.color = color;
  }

  container.appendChild(probe);

  const computed = window.getComputedStyle(probe).color;

  probe.remove();

  return normalizeCssColor(computed.length > 0 ? computed : (color ?? ""));
}

/**
 * Resolves axis / grid / label colors and typography for the plot.
 */
export function readChartTheme(
  container: HTMLElement,
  classes: ChartThemeProbeClasses,
): ChartRenderTheme {
  const style = hasWindow() ? window.getComputedStyle(container) : undefined;
  const fontSize = Number.parseFloat(style?.fontSize ?? "");

  return {
    fontFamily: style?.fontFamily ?? "",
    fontSize: Number.isFinite(fontSize) ? fontSize : 12,
    axisColor: readCssColor(container, { className: classes.axis }),
    gridColor: readCssColor(container, { className: classes.grid }),
    textColor: readCssColor(container, { className: classes.text }),
  };
}

/**
 * Calls `callback` when the color scheme may have changed: OS
 * `prefers-color-scheme`, or `class` / `style` / `data-*` theme attributes
 * on `<html>` and `<body>`. Returns a cleanup function.
 */
export function observeColorScheme(callback: () => void): () => void {
  if (!hasWindow() || !hasDocument()) {
    return () => {};
  }

  const cleanups: Array<() => void> = [];

  if (typeof window.matchMedia === "function") {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", callback);

    cleanups.push(() => {
      media.removeEventListener("change", callback);
    });
  }

  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(callback);
    const options = {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme", "data-mode"],
    };

    observer.observe(document.documentElement, options);

    if (!isNil(document.body)) {
      observer.observe(document.body, options);
    }

    cleanups.push(() => {
      observer.disconnect();
    });
  }

  return () => {
    cleanups.forEach((cleanup) => {
      cleanup();
    });
  };
}

/**
 * Whether the user asked for reduced motion. `false` during SSR.
 */
export function prefersReducedMotion(): boolean {
  if (!hasWindow() || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
