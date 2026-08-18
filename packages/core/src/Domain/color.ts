// ** External Imports
import { clamp, isNil, isString } from "es-toolkit/compat";

/** Serialized color string formats supported by ColorPicker / ColorField. */
export const COLOR_FORMATS = [
  "hex",
  "hsl",
  "rgb",
  "hexa",
  "hsla",
  "rgba",
] as const;

/**
 * Serialized color string format.
 */
export type ColorFormat = (typeof COLOR_FORMATS)[number];

/**
 * HSVA color used as the picker working model.
 * `h` is 0–360, `s`/`v` are 0–100, `a` is 0–1.
 */
export type HsvaColor = {
  /**
   * Alpha channel, 0–1.
   */
  a: number;

  /**
   * Hue in degrees, 0–360.
   */
  h: number;

  /**
   * Saturation percent, 0–100.
   */
  s: number;

  /**
   * Value (brightness) percent, 0–100.
   */
  v: number;
};

/**
 * RGBA color with 0–255 channels and 0–1 alpha.
 */
export type RgbaColor = {
  /**
   * Alpha channel, 0–1.
   */
  a: number;

  /**
   * Blue channel, 0–255.
   */
  b: number;

  /**
   * Green channel, 0–255.
   */
  g: number;

  /**
   * Red channel, 0–255.
   */
  r: number;
};

/**
 * HSLA color. `h` is 0–360, `s`/`l` are 0–100, `a` is 0–1.
 */
export type HslaColor = {
  /**
   * Alpha channel, 0–1.
   */
  a: number;

  /**
   * Hue in degrees, 0–360.
   */
  h: number;

  /**
   * Lightness percent, 0–100.
   */
  l: number;

  /**
   * Saturation percent, 0–100.
   */
  s: number;
};

/** Default working color when the picker has no value (red). */
export const DEFAULT_HSVA: HsvaColor = { a: 1, h: 0, s: 100, v: 100 };

/** Default serialized output format. */
export const DEFAULT_COLOR_FORMAT: ColorFormat = "hex";

const HEX_RE = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGB_RE =
  /^rgba?\(\s*([0-9.]+%?)\s*[, ]\s*([0-9.]+%?)\s*[, ]\s*([0-9.]+%?)(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i;
const HSL_RE =
  /^hsla?\(\s*([0-9.]+)(?:deg)?\s*[, ]\s*([0-9.]+)%\s*[, ]\s*([0-9.]+)%(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i;

/**
 * Clamps a color channel to `[min, max]`.
 */
export function clampColorChannel(
  value: number,
  min: number,
  max: number,
): number {
  return clamp(value, min, max);
}

/**
 * Whether `format` serializes an alpha channel.
 */
export function colorFormatHasAlpha(format: ColorFormat): boolean {
  return format === "hexa" || format === "rgba" || format === "hsla";
}

/**
 * Whether the alpha slider should show. Explicit `alpha` wins; otherwise the
 * format decides.
 */
export function resolveColorAlpha(
  alpha: boolean | undefined,
  format: ColorFormat,
): boolean {
  if (alpha !== undefined) {
    return alpha;
  }

  return colorFormatHasAlpha(format);
}

/**
 * Parses a CSS color string (`hex`, `rgb(a)`, `hsl(a)`). Returns `null` when
 * empty or unrecognized.
 */
export function parseColor(value: null | string | undefined): null | HsvaColor {
  if (isNil(value) || !isString(value)) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  const hex = hexToHsva(trimmed);

  if (hex) {
    return hex;
  }

  const rgb = rgbStringToHsva(trimmed);

  if (rgb) {
    return rgb;
  }

  return hslStringToHsva(trimmed);
}

/**
 * Serializes `color` in `format`.
 */
export function formatColor(color: HsvaColor, format: ColorFormat): string {
  const next = normalizeHsva(color);

  if (format === "hex") {
    return hsvaToHex(next, false);
  }

  if (format === "hexa") {
    return hsvaToHex(next, true);
  }

  if (format === "rgb") {
    const { r, g, b } = hsvaToRgba(next);

    return `rgb(${r}, ${g}, ${b})`;
  }

  if (format === "rgba") {
    const { r, g, b, a } = hsvaToRgba(next);

    return `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`;
  }

  const hsl = hsvaToHsla(next);

  if (format === "hsl") {
    return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
  }

  return `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${formatAlpha(hsl.a)})`;
}

/**
 * Parses then re-serializes `value` in `format`. Returns `null` when empty or
 * invalid.
 */
export function normalizeColorValue(
  value: null | string | undefined,
  format: ColorFormat,
): null | string {
  const parsed = parseColor(value);

  if (!parsed) {
    return null;
  }

  return formatColor(parsed, format);
}

/**
 * Converts HSVA to RGBA.
 */
export function hsvaToRgba(color: HsvaColor): RgbaColor {
  const next = normalizeHsva(color);
  const h = next.h / 360;
  const s = next.s / 100;
  const v = next.v / 100;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const rest = i % 6;
  const channels = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q],
  ][rest] ?? [v, p, q];

  return {
    a: next.a,
    r: Math.round(channels[0] * 255),
    g: Math.round(channels[1] * 255),
    b: Math.round(channels[2] * 255),
  };
}

/**
 * Converts RGBA to HSVA.
 */
export function rgbaToHsva(color: RgbaColor): HsvaColor {
  const r = clampColorChannel(color.r, 0, 255) / 255;
  const g = clampColorChannel(color.g, 0, 255) / 255;
  const b = clampColorChannel(color.b, 0, 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h *= 60;

    if (h < 0) {
      h += 360;
    }
  }

  return {
    h,
    v: max * 100,
    a: clampColorChannel(color.a, 0, 1),
    s: max === 0 ? 0 : (delta / max) * 100,
  };
}

/**
 * Converts HSVA to HSLA.
 */
export function hsvaToHsla(color: HsvaColor): HslaColor {
  const next = normalizeHsva(color);
  const s = next.s / 100;
  const v = next.v / 100;
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

  return {
    a: next.a,
    h: next.h,
    l: l * 100,
    s: sl * 100,
  };
}

/**
 * Converts HSLA to HSVA.
 */
export function hslaToHsva(color: HslaColor): HsvaColor {
  const h = ((color.h % 360) + 360) % 360;
  const l = clampColorChannel(color.l, 0, 100) / 100;
  const s = clampColorChannel(color.s, 0, 100) / 100;
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);

  return {
    h,
    v: v * 100,
    s: sv * 100,
    a: clampColorChannel(color.a, 0, 1),
  };
}

/**
 * Serializes HSVA as `#rrggbb` or `#rrggbbaa`.
 */
export function hsvaToHex(color: HsvaColor, alpha = false): string {
  const { r, g, b, a } = hsvaToRgba(color);
  const hex = `${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;

  if (!alpha) {
    return `#${hex}`;
  }

  return `#${hex}${toHexByte(Math.round(a * 255))}`;
}

/**
 * Parses `#rgb`, `#rgba`, `#rrggbb`, or `#rrggbbaa` (hash optional).
 */
export function hexToHsva(value: string): null | HsvaColor {
  const match = HEX_RE.exec(value.trim());

  if (!match) {
    return null;
  }

  let hex = match[1].toLowerCase();

  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const a = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1;

  return rgbaToHsva({ a, b, g, r });
}

/**
 * CSS `rgba()` string for backgrounds (always includes alpha).
 */
export function toCssRgba(color: HsvaColor): string {
  const { r, g, b, a } = hsvaToRgba(color);

  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`;
}

/**
 * Fully-saturated CSS rgb for a hue, used as the saturation/value area base.
 */
export function hueToCssRgb(hue: number): string {
  const { r, g, b } = hsvaToRgba({ a: 1, h: hue, s: 100, v: 100 });

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Maps a pointer inside `rect` to saturation (x) and value (y, inverted).
 */
export function saturationValueFromPointer(
  clientX: number,
  clientY: number,
  rect: { height: number; left: number; top: number; width: number },
): Pick<HsvaColor, "s" | "v"> {
  const x = unitFromPointer(clientX, rect.left, rect.width);
  const y = unitFromPointer(clientY, rect.top, rect.height);

  return {
    s: x * 100,
    v: (1 - y) * 100,
  };
}

/**
 * Maps a pointer coordinate to 0–1 along an axis.
 */
export function unitFromPointer(
  client: number,
  start: number,
  size: number,
): number {
  if (size <= 0) {
    return 0;
  }

  return clampColorChannel((client - start) / size, 0, 1);
}

/**
 * Whether two HSVA colors match after rounding to serialized precision.
 */
export function colorsEqual(left: HsvaColor, right: HsvaColor): boolean {
  const a = hsvaToRgba(left);
  const b = hsvaToRgba(right);

  return (
    a.r === b.r &&
    a.g === b.g &&
    a.b === b.b &&
    formatAlpha(a.a) === formatAlpha(b.a)
  );
}

/**
 * Whether two color strings parse to the same RGBA.
 */
export function colorStringsEqual(
  left: null | string | undefined,
  right: null | string | undefined,
): boolean {
  const parsedLeft = parseColor(left);
  const parsedRight = parseColor(right);

  if (!parsedLeft || !parsedRight) {
    return false;
  }

  return colorsEqual(parsedLeft, parsedRight);
}

function normalizeHsva(color: HsvaColor): HsvaColor {
  return {
    h: ((color.h % 360) + 360) % 360,
    a: clampColorChannel(color.a, 0, 1),
    s: clampColorChannel(color.s, 0, 100),
    v: clampColorChannel(color.v, 0, 100),
  };
}

function formatAlpha(alpha: number): string {
  const rounded = Math.round(alpha * 100) / 100;

  if (rounded === 1) {
    return "1";
  }

  if (rounded === 0) {
    return "0";
  }

  return String(rounded);
}

function toHexByte(value: number): string {
  return clampColorChannel(Math.round(value), 0, 255)
    .toString(16)
    .padStart(2, "0");
}

function parseRgbChannel(value: string): number {
  if (value.endsWith("%")) {
    return (Number.parseFloat(value) / 100) * 255;
  }

  return Number.parseFloat(value);
}

function parseAlphaChannel(value: string | undefined): number {
  if (value === undefined) {
    return 1;
  }

  if (value.endsWith("%")) {
    return Number.parseFloat(value) / 100;
  }

  return Number.parseFloat(value);
}

function rgbStringToHsva(value: string): null | HsvaColor {
  const match = RGB_RE.exec(value);

  if (!match) {
    return null;
  }

  const r = parseRgbChannel(match[1]);
  const g = parseRgbChannel(match[2]);
  const b = parseRgbChannel(match[3]);
  const a = parseAlphaChannel(match[4]);

  if ([r, g, b, a].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return rgbaToHsva({ a, b, g, r });
}

function hslStringToHsva(value: string): null | HsvaColor {
  const match = HSL_RE.exec(value);

  if (!match) {
    return null;
  }

  const h = Number.parseFloat(match[1]);
  const s = Number.parseFloat(match[2]);
  const l = Number.parseFloat(match[3]);
  const a = parseAlphaChannel(match[4]);

  if ([h, s, l, a].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return hslaToHsva({ a, h, l, s });
}
