// @vitest-environment happy-dom

// ** External Imports
import { afterEach, describe, expect, test, vi } from "vitest";

// ** Local Imports
import {
  normalizeCssColor,
  observeColorScheme,
  prefersReducedMotion,
  readChartTheme,
  readCssBackground,
  readCssColor,
} from "@/Runtime/color";

afterEach(() => {
  document.documentElement.className = "";
  document.body.innerHTML = "";
});

describe("normalizeCssColor", () => {
  test("it should return the input when canvas is unavailable", () => {
    expect(normalizeCssColor("rgb(1, 2, 3)")).toBe("rgb(1, 2, 3)");
    expect(normalizeCssColor("")).toBe("");
  });
});

describe("readCssColor", () => {
  test("it should read an inline color and remove the probe", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const color = readCssColor(container, { color: "rgb(10, 20, 30)" });

    expect(color).toContain("10");
    expect(container.children).toHaveLength(0);
  });
});

describe("readChartTheme", () => {
  test("it should resolve colors and a numeric font size", () => {
    const container = document.createElement("div");
    container.style.fontSize = "14px";
    document.body.appendChild(container);

    const theme = readChartTheme(container, {
      axis: "text-dark-300",
      grid: "text-dark-200",
      text: "text-dark-500",
    });

    expect(theme.fontSize).toBe(14);
    expect(typeof theme.axisColor).toBe("string");
    expect(container.children).toHaveLength(0);
  });
});

describe("readCssBackground", () => {
  test("it should read the nearest painted ancestor", () => {
    const parent = document.createElement("div");
    const child = document.createElement("div");
    parent.style.backgroundColor = "rgb(10, 20, 30)";
    parent.appendChild(child);
    document.body.appendChild(parent);

    expect(readCssBackground(child)).toBe("rgb(10, 20, 30)");
  });

  test("it should fall back to white when nothing is painted", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);

    expect(readCssBackground(element)).toBe("rgb(255, 255, 255)");
  });
});

describe("observeColorScheme", () => {
  test("it should notify when the root class changes and stop after cleanup", async () => {
    const callback = vi.fn();
    const stop = observeColorScheme(callback);

    document.documentElement.classList.add("dark");
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(callback).toHaveBeenCalled();

    stop();
    callback.mockClear();
    document.documentElement.classList.remove("dark");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(callback).not.toHaveBeenCalled();
  });
});

describe("prefersReducedMotion", () => {
  test("it should return a boolean", () => {
    expect(typeof prefersReducedMotion()).toBe("boolean");
  });
});
