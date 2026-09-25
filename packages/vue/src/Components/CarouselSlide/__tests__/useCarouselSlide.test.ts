// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide, useCarouselSlide } from "@/Components/CarouselSlide";

function mountUseCarouselSlide(index = 0) {
  let result!: ReturnType<typeof useCarouselSlide>;

  const Host = defineComponent({
    setup() {
      result = useCarouselSlide({});

      return () => h("div");
    },
  });

  mount(
    defineComponent({
      setup() {
        return () =>
          h(
            Carousel,
            { index },
            {
              default: () => [h(Host), h(CarouselSlide, {}, () => "Other")],
            },
          );
      },
    }),
  );

  return { result };
}

test("it should take the first slide index", () => {
  const { result } = mountUseCarouselSlide(0);

  expect(result.index.value).toBe(0);
  expect(result.selected.value).toBe(true);
});

test("it should not be selected when another index is active", () => {
  const { result } = mountUseCarouselSlide(1);

  expect(result.index.value).toBe(0);
  expect(result.selected.value).toBe(false);
});
