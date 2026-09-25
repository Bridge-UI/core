// ** External Imports
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

afterEach(() => {
  cleanup();
});

test("it should label the active slide", () => {
  render(
    <Carousel aria-label="Photos">
      <CarouselSlide>Front</CarouselSlide>
      <CarouselSlide>Side</CarouselSlide>
    </Carousel>,
  );

  expect(
    screen
      .getByText("Front")
      .closest("[data-part='slide']")
      ?.getAttribute("aria-roledescription"),
  ).toBe("slide");
  expect(
    screen
      .getByText("Front")
      .closest("[data-part='slide']")
      ?.getAttribute("aria-label"),
  ).toBe("Slide 1 of 2");
});

test("it should hide an inactive slide", () => {
  render(
    <Carousel index={1} aria-label="Photos">
      <CarouselSlide>Front</CarouselSlide>
      <CarouselSlide>Side</CarouselSlide>
    </Carousel>,
  );

  expect(
    screen
      .getByText("Front")
      .closest("[data-part='slide']")
      ?.getAttribute("aria-hidden"),
  ).toBe("true");
  expect(
    screen
      .getByText("Side")
      .closest("[data-part='slide']")
      ?.getAttribute("aria-hidden"),
  ).toBeNull();
});
