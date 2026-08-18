// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DEFAULT_COLOR_FORMAT,
  DEFAULT_HSVA,
  clampColorChannel,
  colorFormatHasAlpha,
  colorStringsEqual,
  colorsEqual,
  formatColor,
  hexToHsva,
  hslaToHsva,
  hsvaToHex,
  hsvaToHsla,
  hsvaToRgba,
  hueToCssRgb,
  normalizeColorValue,
  parseColor,
  resolveColorAlpha,
  rgbaToHsva,
  saturationValueFromPointer,
  toCssRgba,
  unitFromPointer,
} from "@/Domain/color";

describe("clampColorChannel", () => {
  test("it should clamp to the given range", () => {
    expect(clampColorChannel(-4, 0, 100)).toBe(0);
    expect(clampColorChannel(140, 0, 100)).toBe(100);
    expect(clampColorChannel(40, 0, 100)).toBe(40);
  });
});

describe("colorFormatHasAlpha", () => {
  test("it should detect alpha formats", () => {
    expect(colorFormatHasAlpha("hex")).toBe(false);
    expect(colorFormatHasAlpha("rgb")).toBe(false);
    expect(colorFormatHasAlpha("hsl")).toBe(false);
    expect(colorFormatHasAlpha("hexa")).toBe(true);
    expect(colorFormatHasAlpha("rgba")).toBe(true);
    expect(colorFormatHasAlpha("hsla")).toBe(true);
  });
});

describe("resolveColorAlpha", () => {
  test("it should prefer the explicit alpha flag", () => {
    expect(resolveColorAlpha(true, "hex")).toBe(true);
    expect(resolveColorAlpha(false, "rgba")).toBe(false);
  });

  test("it should fall back to the format", () => {
    expect(resolveColorAlpha(undefined, "hex")).toBe(false);
    expect(resolveColorAlpha(undefined, "rgba")).toBe(true);
  });
});

describe("parseColor", () => {
  test("it should return null for empty input", () => {
    expect(parseColor(null)).toBeNull();
    expect(parseColor("")).toBeNull();
    expect(parseColor("  ")).toBeNull();
  });

  test("it should parse hex strings", () => {
    expect(formatColor(parseColor("#f00")!, "hex")).toBe("#ff0000");
    expect(formatColor(parseColor("#ea1212")!, "hex")).toBe("#ea1212");
  });

  test("it should parse rgb and rgba strings", () => {
    expect(formatColor(parseColor("rgb(234, 18, 18)")!, "hex")).toBe("#ea1212");
    expect(formatColor(parseColor("rgba(234, 18, 18, 0.87)")!, "rgba")).toBe(
      "rgba(234, 18, 18, 0.87)",
    );
  });

  test("it should parse hsl strings", () => {
    const parsed = parseColor("hsl(0, 100%, 50%)");

    expect(parsed).not.toBeNull();
    expect(formatColor(parsed!, "hex")).toBe("#ff0000");
  });
});

describe("formatColor", () => {
  test("it should default to lowercase hex", () => {
    expect(formatColor(DEFAULT_HSVA, DEFAULT_COLOR_FORMAT)).toBe("#ff0000");
  });

  test("it should serialize rgb, rgba, hsl, and hsla", () => {
    const color = parseColor("#ea1212")!;

    expect(formatColor(color, "rgb")).toBe("rgb(234, 18, 18)");
    expect(formatColor({ ...color, a: 0.87 }, "rgba")).toBe(
      "rgba(234, 18, 18, 0.87)",
    );
    expect(formatColor(DEFAULT_HSVA, "hsl")).toBe("hsl(0, 100%, 50%)");
    expect(formatColor({ ...DEFAULT_HSVA, a: 0.5 }, "hsla")).toBe(
      "hsla(0, 100%, 50%, 0.5)",
    );
  });

  test("it should serialize hexa with alpha", () => {
    expect(formatColor({ ...DEFAULT_HSVA, a: 1 }, "hexa")).toBe("#ff0000ff");
  });
});

describe("normalizeColorValue", () => {
  test("it should reformat a valid color", () => {
    expect(normalizeColorValue("#f00", "rgb")).toBe("rgb(255, 0, 0)");
  });

  test("it should return null for invalid input", () => {
    expect(normalizeColorValue("not-a-color", "hex")).toBeNull();
  });
});

describe("hexToHsva / hsvaToHex", () => {
  test("it should round-trip hex", () => {
    const parsed = hexToHsva("#ea1212");

    expect(parsed).not.toBeNull();
    expect(hsvaToHex(parsed!)).toBe("#ea1212");
  });
});

describe("hsvaToRgba / rgbaToHsva", () => {
  test("it should round-trip red", () => {
    const rgba = hsvaToRgba(DEFAULT_HSVA);

    expect(rgba).toEqual({ a: 1, b: 0, g: 0, r: 255 });
    expect(formatColor(rgbaToHsva(rgba), "hex")).toBe("#ff0000");
  });
});

describe("hsvaToHsla / hslaToHsva", () => {
  test("it should round-trip red", () => {
    const hsla = hsvaToHsla(DEFAULT_HSVA);

    expect(Math.round(hsla.h)).toBe(0);
    expect(Math.round(hsla.s)).toBe(100);
    expect(Math.round(hsla.l)).toBe(50);
    expect(formatColor(hslaToHsva(hsla), "hex")).toBe("#ff0000");
  });
});

describe("toCssRgba / hueToCssRgb", () => {
  test("it should emit css colors", () => {
    expect(toCssRgba(DEFAULT_HSVA)).toBe("rgba(255, 0, 0, 1)");
    expect(hueToCssRgb(0)).toBe("rgb(255, 0, 0)");
  });
});

describe("unitFromPointer / saturationValueFromPointer", () => {
  test("it should clamp pointer units", () => {
    expect(unitFromPointer(5, 0, 10)).toBe(0.5);
    expect(unitFromPointer(-4, 0, 10)).toBe(0);
    expect(unitFromPointer(40, 0, 10)).toBe(1);
  });

  test("it should map the saturation/value area", () => {
    expect(
      saturationValueFromPointer(50, 0, {
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      }),
    ).toEqual({ s: 50, v: 100 });
    expect(
      saturationValueFromPointer(0, 100, {
        top: 0,
        left: 0,
        width: 100,
        height: 100,
      }),
    ).toEqual({ s: 0, v: 0 });
  });
});

describe("colorsEqual / colorStringsEqual", () => {
  test("it should compare parsed colors", () => {
    expect(colorsEqual(DEFAULT_HSVA, parseColor("#ff0000")!)).toBe(true);
    expect(colorStringsEqual("#f00", "rgb(255, 0, 0)")).toBe(true);
    expect(colorStringsEqual("#f00", "#00ff00")).toBe(false);
  });
});
