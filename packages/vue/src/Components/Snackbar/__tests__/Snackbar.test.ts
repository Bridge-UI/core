// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import { Snackbar } from "@/Components/Snackbar";

afterEach(async () => {
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
      duration: false,
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
  mountSnackbar({ props: { title: "Hidden", modelValue: false } });

  expect(
    document.body.querySelector('[data-snackbar-part="panel"]'),
  ).toBeNull();
});

test("it should teleport to body when modelValue is true", async () => {
  mountSnackbar({
    slots: { default: "Body" },
    props: {
      title: "Toast",
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
      modelValue: true,
      position: "top-center",
    },
  });

  await flushPromises();

  const layer = document.body.querySelector("[data-snackbar-layer]");

  expect(layer?.className).toContain("items-start");
  expect(layer?.className).toContain("justify-center");
});

test("standalone snackbars should stack with increasing z-index", async () => {
  mountSnackbar({
    props: {
      title: "One",
      modelValue: true,
    },
  });

  mountSnackbar({
    props: {
      title: "Two",
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

test("standalone snackbar should not lock body scroll", async () => {
  mountSnackbar({
    props: {
      title: "Toast",
      modelValue: true,
    },
  });

  await flushPromises();

  expect(document.body.style.overflow).not.toBe("hidden");
});
