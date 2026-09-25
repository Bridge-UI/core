// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

async function mountSlides(index?: number) {
  const wrapper = mount(Carousel, {
    props: { index },
    attrs: { "aria-label": "Photos" },
    slots: {
      default: () => [
        h(CarouselSlide, {}, () => "Front"),
        h(CarouselSlide, {}, () => "Side"),
      ],
    },
  });

  await flushPromises();

  return wrapper;
}

test("it should label the active slide", async () => {
  const wrapper = await mountSlides();
  const slide = wrapper.get("[data-part='slide']");

  expect(slide.attributes("aria-roledescription")).toBe("slide");
  expect(slide.attributes("aria-label")).toBe("Slide 1 of 2");
});

test("it should hide an inactive slide", async () => {
  const wrapper = await mountSlides(1);
  const slides = wrapper.findAll("[data-part='slide']");

  expect(slides[0]?.attributes("aria-hidden")).toBe("true");
  expect(slides[1]?.attributes("aria-hidden")).toBeUndefined();
});
