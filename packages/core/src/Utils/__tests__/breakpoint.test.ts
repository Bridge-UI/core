// @vitest-environment happy-dom

// ** External Imports
import { afterEach, describe, expect, test, vi } from "vitest";

// ** Local Imports
import {
  DEFAULT_BREAKPOINTS,
  buildBreakpointSnapshot,
  createBreakpointObserver,
  cssLengthToPx,
  discoverBreakpointKeys,
  resetBreakpointCachesForTests,
  resolveBreakpoints,
} from "@/Utils/breakpoint";

afterEach(() => {
  document.documentElement.removeAttribute("style");
  document.head.querySelectorAll("[data-breakpoint-test]").forEach((node) => {
    node.remove();
  });
  resetBreakpointCachesForTests();
  vi.restoreAllMocks();
});

function mockMatchMedia() {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    media: query,
    matches: false,
    onchange: null,
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe("cssLengthToPx", () => {
  test("it should convert rem values using the root font size", () => {
    expect(cssLengthToPx("40rem", 16)).toBe(640);
    expect(cssLengthToPx("40rem", 10)).toBe(400);
  });

  test("it should convert px values", () => {
    expect(cssLengthToPx("768px")).toBe(768);
  });
});

describe("resolveBreakpoints", () => {
  test("it should return Tailwind defaults in px", () => {
    const thresholds = resolveBreakpoints();

    expect(thresholds.sm).toBe(cssLengthToPx(DEFAULT_BREAKPOINTS.sm));
    expect(thresholds.md).toBe(cssLengthToPx(DEFAULT_BREAKPOINTS.md));
    expect(thresholds["2xl"]).toBe(cssLengthToPx(DEFAULT_BREAKPOINTS["2xl"]));
  });

  test("it should prefer CSS variables over defaults", () => {
    document.documentElement.style.setProperty("--breakpoint-sm", "30rem");

    expect(resolveBreakpoints().sm).toBe(480);
  });

  test("it should prefer explicit overrides over CSS variables", () => {
    document.documentElement.style.setProperty("--breakpoint-sm", "30rem");

    expect(resolveBreakpoints({ sm: "20rem" }).sm).toBe(320);
  });

  test("it should include custom breakpoint overrides", () => {
    expect(resolveBreakpoints({ "3xl": "120rem" })["3xl"]).toBe(1920);
  });

  test("it should cache discoverBreakpointKeys across calls", () => {
    const first = discoverBreakpointKeys();
    const second = discoverBreakpointKeys();

    expect(second).toBe(first);
  });

  test("it should discover nested grouping-rule breakpoint variables", () => {
    const style = document.createElement("style");
    style.setAttribute("data-breakpoint-test", "true");
    style.textContent = `
      @media all {
        :root {
          --breakpoint-3xl: 120rem;
        }
      }
    `;
    document.head.appendChild(style);

    resetBreakpointCachesForTests();

    expect(discoverBreakpointKeys()).toContain("3xl");
    expect(resolveBreakpoints()["3xl"]).toBe(1920);
  });
});

describe("buildBreakpointSnapshot", () => {
  const thresholds = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  test("it should use xs below the smallest threshold", () => {
    const snapshot = buildBreakpointSnapshot(320, 600, thresholds);

    expect(snapshot.name).toBe("xs");
    expect(snapshot.lessThan("sm")).toBe(true);
    expect(snapshot.greaterOrEqual("sm")).toBe(false);
    expect(snapshot.mobile).toBe(true);
  });

  test("it should compare against named thresholds", () => {
    const snapshot = buildBreakpointSnapshot(800, 600, thresholds);

    expect(snapshot.name).toBe("md");
    expect(snapshot.greaterOrEqual("sm")).toBe(true);
    expect(snapshot.greaterOrEqual("md")).toBe(true);
    expect(snapshot.greaterOrEqual("lg")).toBe(false);
    expect(snapshot.lessThan("lg")).toBe(true);
    expect(snapshot.lessOrEqual("md")).toBe(false);
    expect(snapshot.lessOrEqual("lg")).toBe(true);
    expect(snapshot.greaterThan("md")).toBe(true);
    expect(snapshot.between("sm", "lg")).toBe(true);
    expect(snapshot.mobile).toBe(false);
  });

  test("it should return false for unknown breakpoint names", () => {
    const snapshot = buildBreakpointSnapshot(800, 600, thresholds);

    expect(snapshot.lessThan("tablet")).toBe(false);
    expect(snapshot.lessOrEqual("tablet")).toBe(false);
    expect(snapshot.greaterThan("tablet")).toBe(false);
    expect(snapshot.greaterOrEqual("tablet")).toBe(false);
  });

  test("it should honor a custom mobileBreakpoint", () => {
    const snapshot = buildBreakpointSnapshot(700, 600, thresholds, "md");

    expect(snapshot.mobile).toBe(true);
  });

  test("it should fall back to sm when mobileBreakpoint is unknown", () => {
    const snapshot = buildBreakpointSnapshot(700, 600, thresholds, "tablet");

    expect(snapshot.mobile).toBe(false);
  });
});

describe("createBreakpointObserver", () => {
  test("it should expose the current viewport snapshot", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 900,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 700,
      configurable: true,
    });
    mockMatchMedia();

    const observer = createBreakpointObserver();
    const unsubscribe = observer.subscribe(() => undefined);
    const snapshot = observer.getSnapshot();

    expect(snapshot.width).toBe(900);
    expect(snapshot.height).toBe(700);
    expect(snapshot.greaterOrEqual("sm")).toBe(true);
    expect(snapshot.name).toBe("md");

    unsubscribe();
  });

  test("it should notify subscribers on resize", () => {
    Object.defineProperty(window, "innerWidth", {
      value: 500,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 500,
      configurable: true,
    });
    mockMatchMedia();

    const observer = createBreakpointObserver();
    const listener = vi.fn();
    const unsubscribe = observer.subscribe(listener);

    Object.defineProperty(window, "innerWidth", {
      value: 1000,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));

    expect(listener).toHaveBeenCalled();
    expect(observer.getSnapshot().width).toBe(1000);
    expect(observer.getSnapshot().greaterOrEqual("sm")).toBe(true);

    unsubscribe();
  });

  test("it should share one listener set for equivalent options", () => {
    mockMatchMedia();

    const first = createBreakpointObserver({ mobileBreakpoint: "sm" });
    const second = createBreakpointObserver({ mobileBreakpoint: "sm" });
    const unsubFirst = first.subscribe(() => undefined);
    const unsubSecond = second.subscribe(() => undefined);

    expect(window.matchMedia).toHaveBeenCalledTimes(
      Object.keys(DEFAULT_BREAKPOINTS).length,
    );

    unsubFirst();
    unsubSecond();
  });

  test("it should tear down shared listeners after the last unsubscribe", () => {
    mockMatchMedia();

    const first = createBreakpointObserver();
    const second = createBreakpointObserver();
    const unsubFirst = first.subscribe(() => undefined);
    const unsubSecond = second.subscribe(() => undefined);
    const addCount = (window.matchMedia as ReturnType<typeof vi.fn>).mock.calls
      .length;

    unsubFirst();
    unsubSecond();

    const third = createBreakpointObserver();
    const unsubThird = third.subscribe(() => undefined);

    expect(window.matchMedia).toHaveBeenCalledTimes(
      addCount + Object.keys(DEFAULT_BREAKPOINTS).length,
    );

    unsubThird();
  });

  test("it should not attach listeners until subscribe", () => {
    mockMatchMedia();

    createBreakpointObserver();

    expect(window.matchMedia).not.toHaveBeenCalled();
  });

  test("it should expose a server snapshot for hydration", () => {
    const snapshot = createBreakpointObserver().getServerSnapshot();

    expect(snapshot.width).toBe(0);
    expect(snapshot.height).toBe(0);
    expect(snapshot.name).toBe("xs");
    expect(snapshot.mobile).toBe(true);
  });
});
