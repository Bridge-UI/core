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

test("it should let classes override the vertical size tokens", () => {
  const { result } = mountUseCarousel({
    orientation: "vertical",
    classes: { viewport: "h-96", track: "flex-row", controls: "flex-row" },
  });

  expect(result.viewportBind.value.class).toContain("h-96");
  expect(result.trackBind.value.class).toContain("flex-row");
  expect(result.controlsBind.value.class).toContain("flex-row");
  expect(result.viewportBind.value.class).not.toContain("h-64");
  expect(result.trackBind.value.class).not.toContain("flex-col");
  expect(result.controlsBind.value.class).not.toContain("flex-col");
});
