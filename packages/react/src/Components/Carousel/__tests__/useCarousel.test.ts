// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { useCarousel } from "@/Components/Carousel";

afterEach(() => {
  cleanup();
});

const libDefaults = {
  gap: 0,
  size: "md",
  loop: false,
  autoPlay: false,
  defaultIndex: 0,
  indicators: true,
  slidesPerView: 1,
  orientation: "horizontal",
} as const;

test("it should start at the first slide", () => {
  const { result } = renderHook(() => useCarousel({}, libDefaults));

  expect(result.current.activeIndex).toBe(0);
  expect(result.current.showControls).toBe(false);
  expect(result.current.rootBind.role).toBe("region");
  expect(result.current.contextValue.id).toContain("bridge-carousel");
});

test("it should use defaultIndex when uncontrolled", () => {
  const { result } = renderHook(() =>
    useCarousel({ defaultIndex: 2 }, libDefaults),
  );

  expect(result.current.activeIndex).toBe(2);
  expect(result.current.contextValue.activeIndex).toBe(2);
});

test("it should let classes override the vertical size tokens", () => {
  const { result } = renderHook(() =>
    useCarousel(
      {
        orientation: "vertical",
        classes: { viewport: "h-96", track: "flex-row", controls: "flex-row" },
      },
      libDefaults,
    ),
  );

  expect(result.current.viewportBind.className).toContain("h-96");
  expect(result.current.trackBind.className).toContain("flex-row");
  expect(result.current.controlsBind.className).toContain("flex-row");
  expect(result.current.viewportBind.className).not.toContain("h-64");
  expect(result.current.trackBind.className).not.toContain("flex-col");
  expect(result.current.controlsBind.className).not.toContain("flex-col");
});
