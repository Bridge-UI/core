// ** External Imports
import { describe, expect, test } from "vitest";

// ** Local Imports
import {
  DEFAULT_CAROUSEL_AUTOPLAY_INTERVAL,
  canMoveCarousel,
  clampCarouselIndex,
  getAdjacentCarouselIndex,
  getCarouselMaxIndex,
  getCarouselSlideId,
  getCarouselTrackOffset,
  isCarouselSlideInView,
  resolveCarouselAutoPlayInterval,
  resolveCarouselSwipeDirection,
  shouldPauseCarouselAutoPlay,
} from "@/Domain/carousel";

describe("clampCarouselIndex", () => {
  test("it should clamp a slide index into range", () => {
    expect(clampCarouselIndex(0, 0)).toBe(0);
    expect(clampCarouselIndex(-2, 3)).toBe(0);
    expect(clampCarouselIndex(1.9, 3)).toBe(1);
    expect(clampCarouselIndex(8, 3)).toBe(2);
    expect(clampCarouselIndex(Number.NaN, 3)).toBe(0);
  });
});

describe("getAdjacentCarouselIndex", () => {
  test("it should stay on the edge when loop is off", () => {
    expect(
      getAdjacentCarouselIndex({
        count: 3,
        index: 0,
        loop: false,
        direction: -1,
      }),
    ).toBe(0);
    expect(
      getAdjacentCarouselIndex({
        count: 3,
        index: 2,
        loop: false,
        direction: 1,
      }),
    ).toBe(2);
    expect(
      getAdjacentCarouselIndex({
        count: 3,
        index: 1,
        loop: false,
        direction: 1,
      }),
    ).toBe(2);
  });

  test("it should wrap when loop is on", () => {
    expect(
      getAdjacentCarouselIndex({
        count: 3,
        index: 0,
        loop: true,
        direction: -1,
      }),
    ).toBe(2);
    expect(
      getAdjacentCarouselIndex({
        count: 3,
        index: 2,
        loop: true,
        direction: 1,
      }),
    ).toBe(0);
  });
});

describe("canMoveCarousel", () => {
  test("it should block movement when there is nothing to move to", () => {
    expect(
      canMoveCarousel({ count: 0, index: 0, loop: true, direction: 1 }),
    ).toBe(false);
    expect(
      canMoveCarousel({ count: 1, index: 0, loop: true, direction: 1 }),
    ).toBe(false);
    expect(
      canMoveCarousel({ count: 3, index: 0, loop: false, direction: -1 }),
    ).toBe(false);
    expect(
      canMoveCarousel({ count: 3, index: 2, loop: false, direction: 1 }),
    ).toBe(false);
    expect(
      canMoveCarousel({
        count: 3,
        index: 0,
        loop: false,
        direction: 1,
        slidesPerView: 3,
      }),
    ).toBe(false);
  });

  test("it should allow wrapping when loop is on", () => {
    expect(
      canMoveCarousel({ count: 3, index: 0, loop: true, direction: -1 }),
    ).toBe(true);
    expect(
      canMoveCarousel({ count: 3, index: 1, loop: false, direction: 1 }),
    ).toBe(true);
  });

  test("it should stop when the last slides already fill the viewport", () => {
    expect(
      canMoveCarousel({
        count: 5,
        index: 1,
        loop: false,
        direction: 1,
        slidesPerView: 2,
      }),
    ).toBe(true);
    expect(
      canMoveCarousel({
        count: 5,
        index: 3,
        loop: false,
        direction: 1,
        slidesPerView: 2,
      }),
    ).toBe(false);
  });
});

describe("getCarouselMaxIndex", () => {
  test("it should keep the last page filled", () => {
    expect(getCarouselMaxIndex(5, 2)).toBe(3);
    expect(getCarouselMaxIndex(3, 3)).toBe(0);
    expect(getCarouselMaxIndex(5, 2.5)).toBe(3);
  });
});

describe("getCarouselTrackOffset", () => {
  test("it should translate by full slides", () => {
    expect(getCarouselTrackOffset(0)).toBe("translate3d(0%, 0, 0)");
    expect(getCarouselTrackOffset(2)).toBe("translate3d(-200%, 0, 0)");
  });

  test("it should size the step from slidesPerView and orientation", () => {
    expect(getCarouselTrackOffset(1, { slidesPerView: 2 })).toBe(
      "translate3d(-50%, 0, 0)",
    );
    expect(
      getCarouselTrackOffset(1, {
        slidesPerView: 1,
        orientation: "vertical",
      }),
    ).toBe("translate3d(0, -100%, 0)");
    expect(getCarouselTrackOffset(1, { gap: 16, slidesPerView: 3 })).toBe(
      "translate3d(calc(-33.333% + -5.333px), 0, 0)",
    );
  });
});

describe("isCarouselSlideInView", () => {
  test("it should include neighbors when more than one slide is visible", () => {
    expect(
      isCarouselSlideInView({
        slideIndex: 0,
        activeIndex: 0,
        slidesPerView: 1,
      }),
    ).toBe(true);
    expect(
      isCarouselSlideInView({
        slideIndex: 1,
        activeIndex: 0,
        slidesPerView: 1,
      }),
    ).toBe(false);
    expect(
      isCarouselSlideInView({
        slideIndex: 1,
        activeIndex: 0,
        slidesPerView: 2,
      }),
    ).toBe(true);
    expect(
      isCarouselSlideInView({
        slideIndex: 2,
        activeIndex: 0,
        slidesPerView: 2,
      }),
    ).toBe(false);
  });
});

describe("getCarouselSlideId", () => {
  test("it should build a stable slide id", () => {
    expect(getCarouselSlideId("carousel-1", 2)).toBe("carousel-1-slide-2");
  });
});

describe("resolveCarouselAutoPlayInterval", () => {
  test("it should resolve auto-play to milliseconds", () => {
    expect(resolveCarouselAutoPlayInterval(undefined)).toBeNull();
    expect(resolveCarouselAutoPlayInterval(false)).toBeNull();
    expect(resolveCarouselAutoPlayInterval(0)).toBeNull();
    expect(resolveCarouselAutoPlayInterval(true)).toBe(
      DEFAULT_CAROUSEL_AUTOPLAY_INTERVAL,
    );
    expect(resolveCarouselAutoPlayInterval(2500)).toBe(2500);
  });
});

describe("resolveCarouselSwipeDirection", () => {
  test("it should ignore short and vertical gestures", () => {
    expect(resolveCarouselSwipeDirection(-10, 0)).toBeNull();
    expect(resolveCarouselSwipeDirection(-80, 90)).toBeNull();
  });

  test("it should map a horizontal swipe to a direction", () => {
    expect(resolveCarouselSwipeDirection(-80, 10)).toBe(1);
    expect(resolveCarouselSwipeDirection(80, 10)).toBe(-1);
  });

  test("it should follow the vertical axis and right-to-left", () => {
    expect(
      resolveCarouselSwipeDirection(-10, -80, { orientation: "vertical" }),
    ).toBe(1);
    expect(resolveCarouselSwipeDirection(-80, 10, { rtl: true })).toBe(-1);
  });
});

describe("shouldPauseCarouselAutoPlay", () => {
  test("it should pause while hovered, focused, or reduced motion", () => {
    expect(
      shouldPauseCarouselAutoPlay({
        focused: false,
        hovered: false,
        reducedMotion: false,
      }),
    ).toBe(false);
    expect(
      shouldPauseCarouselAutoPlay({
        hovered: true,
        focused: false,
        reducedMotion: false,
      }),
    ).toBe(true);
    expect(
      shouldPauseCarouselAutoPlay({
        focused: true,
        hovered: false,
        reducedMotion: false,
      }),
    ).toBe(true);
    expect(
      shouldPauseCarouselAutoPlay({
        focused: false,
        hovered: false,
        reducedMotion: true,
      }),
    ).toBe(true);
  });
});
