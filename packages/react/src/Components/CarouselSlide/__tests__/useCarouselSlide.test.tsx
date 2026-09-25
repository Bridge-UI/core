// ** External Imports
import { cleanup, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide, useCarouselSlide } from "@/Components/CarouselSlide";

afterEach(() => {
  cleanup();
});

function wrapper({ children }: { children: ReactNode }) {
  return <Carousel index={0}>{children}</Carousel>;
}

test("it should take the first slide index", () => {
  const { result } = renderHook(() => useCarouselSlide({}), { wrapper });

  expect(result.current.index).toBe(0);
  expect(result.current.selected).toBe(true);
});

test("it should not be selected when another index is active", () => {
  function later({ children }: { children: ReactNode }) {
    return (
      <Carousel index={1}>
        {children}
        <CarouselSlide>Other</CarouselSlide>
      </Carousel>
    );
  }

  const { result } = renderHook(() => useCarouselSlide({}), {
    wrapper: later,
  });

  expect(result.current.index).toBe(0);
  expect(result.current.selected).toBe(false);
});
