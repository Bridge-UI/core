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
