// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { Snackbar } from "@/Components/Snackbar";

afterEach(async () => {
  vi.useRealTimers();

  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Snackbar>>> = [];

function mountSnackbar(
  options: Parameters<typeof mount<typeof Snackbar>>[1] = {},
) {
  const wrapper = mount(Snackbar, {
    attachTo: document.body,
    ...options,
    props: {
      modelValue: false,
      transition: "none",
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: boolean) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should not render in the document when modelValue is false", () => {
  mountSnackbar({
    props: { title: "Hidden", duration: false, modelValue: false },
  });

  expect(
    document.body.querySelector('[data-snackbar-part="panel"]'),
  ).toBeNull();
});

test("it should teleport to body when modelValue is true", async () => {
  mountSnackbar({
    slots: { default: "Body" },
    props: {
      title: "Toast",
      duration: false,
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.querySelector('[role="status"]')).not.toBeNull();
  expect(document.body.textContent).toContain("Toast");
  expect(document.body.textContent).toContain("Body");
  expect(document.body.querySelector("[data-snackbar-layer]")).not.toBeNull();
});

test("it should emit update:modelValue when the close button is clicked", async () => {
  const wrapper = mountSnackbar({
    props: {
      duration: false,
      modelValue: true,
      title: "Close me",
    },
  });

  await flushPromises();

  const closeButton = document.body.querySelector('button[aria-label="Close"]');

  await closeButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
});

test("it should emit close when the close button is clicked", async () => {
  const wrapper = mountSnackbar({
    props: {
      duration: false,
      modelValue: true,
      title: "Close me",
    },
  });

  await flushPromises();

  const closeButton = document.body.querySelector('button[aria-label="Close"]');

  await closeButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(wrapper.emitted("close")).toHaveLength(1);
});

test("it should emit update:modelValue on escape keydown", async () => {
  const wrapper = mountSnackbar({
    props: {
      duration: false,
      modelValue: true,
      title: "Dismiss",
    },
  });

  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
});

test("it should render title and description when modelValue is true", async () => {
  mountSnackbar({
    props: {
      title: "Hello",
      duration: false,
      modelValue: true,
      description: "World",
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Hello");
  expect(document.body.textContent).toContain("World");
});

test("it should apply top-center position classes on the portal layer", async () => {
  mountSnackbar({
    props: {
      title: "Top",
      duration: false,
      modelValue: true,
      position: "top-center",
    },
  });

  await flushPromises();

  const layer = document.body.querySelector("[data-snackbar-layer]");

  expect(layer?.className).toContain("items-start");
  expect(layer?.className).toContain("justify-center");
});

test("it should stack with increasing z-index", async () => {
  mountSnackbar({
    props: {
      title: "One",
      duration: false,
      modelValue: true,
    },
  });

  mountSnackbar({
    props: {
      title: "Two",
      duration: false,
      modelValue: true,
    },
  });

  await flushPromises();

  const layers = document.body.querySelectorAll("[data-snackbar-layer]");

  expect(layers.length).toBe(2);

  const firstZ = Number((layers[0] as HTMLElement).style.zIndex);
  const secondZ = Number((layers[1] as HTMLElement).style.zIndex);

  expect(secondZ).toBeGreaterThan(firstZ);
});

test("it should render the progress bar by default", async () => {
  mountSnackbar({
    props: {
      title: "Toast",
      modelValue: true,
    },
  });

  await flushPromises();

  const panel = document.body.querySelector('[data-snackbar-part="panel"]');
  const progress = panel?.querySelector(":scope > .h-0\\.5");

  expect(progress?.className).toContain("bg-primary-500");
});

test("it should auto-dismiss after the default duration", async () => {
  vi.useFakeTimers();

  const wrapper = mountSnackbar({
    props: {
      title: "Timed",
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.textContent).toContain("Timed");

  await vi.advanceTimersByTimeAsync(5000);
  await flushPromises();

  expect(wrapper.props("modelValue")).toBe(false);
});

test("it should not lock body scroll", async () => {
  mountSnackbar({
    props: {
      title: "Toast",
      duration: false,
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.style.overflow).not.toBe("hidden");
});
