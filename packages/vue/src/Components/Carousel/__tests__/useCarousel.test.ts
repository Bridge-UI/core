// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, ref } from "vue";

// ** Local Imports
import type { CarouselOwnProps } from "@/Components/Carousel";
import { useCarousel } from "@/Components/Carousel";

const libDefaults = {
  gap: 0,
  size: "md",
  loop: false,
  align: "start",
  autoPlay: false,
  defaultIndex: 0,
  indicators: true,
  slidesPerView: 1,
  orientation: "horizontal",
} as const;

function mountUseCarousel(props: CarouselOwnProps = {}) {
  let result!: ReturnType<typeof useCarousel>;

  const Host = defineComponent({
    setup() {
      result = useCarousel(props, libDefaults, ref(undefined));

      return () => null;
    },
  });

  mount(Host);

  return { result };
}

test("it should start at the first slide", () => {
  const { result } = mountUseCarousel();

  expect(result.activeIndex.value).toBe(0);
  expect(result.showControls.value).toBe(false);
  expect(result.rootBind.value.role).toBe("region");
});

test("it should use defaultIndex when uncontrolled", () => {
  const { result } = mountUseCarousel({ defaultIndex: 2 });

  expect(result.activeIndex.value).toBe(2);
});
