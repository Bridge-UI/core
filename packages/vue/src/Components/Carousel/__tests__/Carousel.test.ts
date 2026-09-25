// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { Carousel } from "@/Components/Carousel";
import { CarouselSlide } from "@/Components/CarouselSlide";

afterEach(async () => {
  while (mounted.length > 0) {
    mounted.pop()?.unmount();
  }

  await flushPromises();
});

const mounted: Array<ReturnType<typeof mount>> = [];

function slides() {
  return [
    h(CarouselSlide, {}, () => "One"),
    h(CarouselSlide, {}, () => "Two"),
    h(CarouselSlide, {}, () => "Three"),
  ];
}

async function mountCarousel(
  props: Record<string, unknown> = {},
  options: { syncIndex?: boolean } = { syncIndex: true },
) {
  const wrapper = mount(Carousel, {
    slots: { default: slides },
    attrs: { "aria-label": "Photos" },
    props: {
      ...props,
      "onUpdate:index": (value: number) => {
        if (options.syncIndex) {
          wrapper.setProps({ index: value });
        }
      },
    },
  });

  mounted.push(wrapper);
  await flushPromises();

  return wrapper;
}

function slideOf(wrapper: ReturnType<typeof mount>, name: string) {
  return wrapper
    .findAll("[data-part='slide']")
    .find((node) => node.text() === name);
}

test("it should show the first slide and disable previous", async () => {
  const wrapper = await mountCarousel();

  expect(slideOf(wrapper, "One")?.attributes("aria-hidden")).toBeUndefined();
  expect(slideOf(wrapper, "Two")?.attributes("aria-hidden")).toBe("true");
  expect(slideOf(wrapper, "Two")?.attributes("inert")).toBe("");
  expect(wrapper.get("[data-part='prev']").attributes("disabled")).toBe("");
  expect(
    wrapper.get("[role='region']").attributes("aria-roledescription"),
  ).toBe("carousel");
  expect(wrapper.findAll("[data-part='indicator']")).toHaveLength(3);
});

test("it should move to the next slide", async () => {
  const wrapper = await mountCarousel();

  await wrapper.get("[data-part='next']").trigger("click");

  expect(slideOf(wrapper, "Two")?.attributes("aria-hidden")).toBeUndefined();
  expect(wrapper.emitted("update:index")?.[0]).toEqual([1]);
});

test("it should wrap when loop is on", async () => {
  const wrapper = await mountCarousel({ loop: true });

  await wrapper.get("[data-part='prev']").trigger("click");

  expect(slideOf(wrapper, "Three")?.attributes("aria-hidden")).toBeUndefined();
});

test("it should stay on the last slide when loop is off", async () => {
  const wrapper = await mountCarousel();
  const next = wrapper.get("[data-part='next']");

  await next.trigger("click");
  await next.trigger("click");
  await next.trigger("click");

  expect(slideOf(wrapper, "Three")?.attributes("aria-hidden")).toBeUndefined();
  expect(next.attributes("disabled")).toBe("");
});

test("it should select a slide from an indicator", async () => {
  const wrapper = await mountCarousel();

  await wrapper.get("[aria-label='Go to slide 3']").trigger("click");

  expect(slideOf(wrapper, "Three")?.attributes("aria-hidden")).toBeUndefined();
  expect(
    wrapper.get("[aria-label='Go to slide 3']").attributes("aria-current"),
  ).toBe("true");
});

test("it should move with the arrow keys", async () => {
  const wrapper = await mountCarousel();
  const region = wrapper.get("[role='region']");

  await region.trigger("keydown", { key: "ArrowRight" });

  expect(slideOf(wrapper, "Two")?.attributes("aria-hidden")).toBeUndefined();

  await region.trigger("keydown", { key: "Home" });

  expect(slideOf(wrapper, "One")?.attributes("aria-hidden")).toBeUndefined();
});

test("it should move on a horizontal swipe", async () => {
  const wrapper = await mountCarousel();
  const viewport = wrapper.get("[data-part='viewport']");

  await viewport.trigger("pointerdown", {
    button: 0,
    clientY: 20,
    clientX: 220,
    pointerId: 1,
    pointerType: "touch",
  });
  await viewport.trigger("pointerup", {
    clientX: 40,
    clientY: 24,
    pointerId: 1,
    pointerType: "touch",
  });

  expect(slideOf(wrapper, "Two")?.attributes("aria-hidden")).toBeUndefined();
});

test("it should keep a controlled index until the parent updates", async () => {
  const wrapper = await mountCarousel({ index: 0 }, { syncIndex: false });

  await wrapper.get("[data-part='next']").trigger("click");

  expect(wrapper.emitted("update:index")?.[0]).toEqual([1]);
  expect(slideOf(wrapper, "One")?.attributes("aria-hidden")).toBeUndefined();
});

test("it should hide indicators", async () => {
  const wrapper = await mountCarousel({ indicators: false });

  expect(wrapper.find("[data-part='indicators']").exists()).toBe(false);
});

test("it should announce a slide change", async () => {
  const wrapper = await mountCarousel();

  await wrapper.get("[data-part='next']").trigger("click");

  expect(wrapper.get("[data-part='live']").text()).toBe("Slide 2 of 3");
});

test("it should reveal the next slide and stop when the page is full", async () => {
  const wrapper = await mountCarousel({ slidesPerView: 2 });

  expect(slideOf(wrapper, "One")?.attributes("aria-hidden")).toBeUndefined();
  expect(slideOf(wrapper, "Two")?.attributes("aria-hidden")).toBeUndefined();
  expect(slideOf(wrapper, "Three")?.attributes("aria-hidden")).toBe("true");

  await wrapper.get("[data-part='next']").trigger("click");
  await flushPromises();

  expect(slideOf(wrapper, "Three")?.attributes("aria-hidden")).toBeUndefined();
  expect(wrapper.get("[data-part='next']").attributes("disabled")).toBe("");
});

test("it should move a vertical carousel with the down arrow", async () => {
  const wrapper = await mountCarousel({ orientation: "vertical" });

  expect(wrapper.get("[role='region']").attributes("data-orientation")).toBe(
    "vertical",
  );

  await wrapper.get("[role='region']").trigger("keydown", { key: "ArrowDown" });
  await flushPromises();

  expect(slideOf(wrapper, "Two")?.attributes("aria-hidden")).toBeUndefined();
});

test("it should auto-advance and pause while hovered", async () => {
  vi.useFakeTimers();

  try {
    const wrapper = await mountCarousel(
      { autoPlay: 400 },
      { syncIndex: false },
    );

    await vi.advanceTimersByTimeAsync(400);
    await flushPromises();

    expect(wrapper.emitted("update:index")?.[0]).toEqual([1]);

    await wrapper.get("[role='region']").trigger("mouseenter");
    wrapper.emitted("update:index")?.splice(0);

    await vi.advanceTimersByTimeAsync(800);
    await flushPromises();

    expect(wrapper.emitted("update:index") ?? []).toEqual([]);
  } finally {
    vi.useRealTimers();
  }
});
