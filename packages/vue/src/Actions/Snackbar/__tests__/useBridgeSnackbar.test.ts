// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core";

// ** Local Imports
import {
  BridgeSnackbarHost,
  BridgeSnackbarHostMissingError,
  useBridgeSnackbar,
} from "@/Actions/Snackbar";
afterEach(() => {
  vi.useRealTimers();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function mountWithSnackbarHost(child: ReturnType<typeof defineComponent>) {
  return mount(BridgeSnackbarHost, {
    attachTo: document.body,
    slots: { default: () => h(child) },
  });
}

test("useBridgeSnackbar should throw when BridgeSnackbarHost is missing", () => {
  const BadConsumer = defineComponent({
    setup() {
      useBridgeSnackbar();
    },
  });

  expect(() => mount(BadConsumer)).toThrow(BridgeSnackbarHostMissingError);
});

test("open should return an id and render snackbar content", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "Saved",
        duration: false,
        transition: "none",
        description: "Changes stored",
      });
    },
  });

  mountWithSnackbarHost(Consumer);
  await flushPromises();
  await nextTick();

  expect(document.body.textContent).toContain("Saved");
  expect(document.body.textContent).toContain("Changes stored");
});

test("close should dismiss a snackbar", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      const id = snackbar.open({
        duration: false,
        transition: "none",
        title: "Dismiss me",
      });

      snackbar.close(id);
    },
  });

  mount(BridgeSnackbarHost, {
    attachTo: document.body,
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  expect(document.body.textContent).not.toContain("Dismiss me");
});

test("closeAll should dismiss every snackbar", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "One",
        duration: false,
        transition: "none",
      });
      snackbar.open({
        title: "Two",
        duration: false,
        transition: "none",
      });

      snackbar.closeAll();
    },
  });

  mountWithSnackbarHost(Consumer);
  await flushPromises();
  await nextTick();

  expect(document.body.textContent).not.toContain("One");
  expect(document.body.textContent).not.toContain("Two");
});

test("accept action should use the snackbar color, not primary", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "Saved",
        color: "success",
        duration: false,
        transition: "none",
        actions: { accept: { label: "Undo" } },
      });
    },
  });

  mountWithSnackbarHost(Consumer);
  await flushPromises();
  await nextTick();

  const action = document.body.querySelector("button");

  expect(action).toBeTruthy();
  expect(action?.className).toContain("text-success-600");
  expect(action?.className).not.toContain("text-primary-600");
});

test("imperative snackbars should stack with increasing z-index", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "One",
        duration: false,
        transition: "none",
      });
      snackbar.open({
        title: "Two",
        duration: false,
        transition: "none",
      });
    },
  });

  mountWithSnackbarHost(Consumer);
  await flushPromises();
  await nextTick();

  const layers = document.body.querySelectorAll("[data-snackbar-layer]");

  expect(layers.length).toBe(2);

  const firstZ = Number((layers[0] as HTMLElement).style.zIndex);
  const secondZ = Number((layers[1] as HTMLElement).style.zIndex);

  expect(secondZ).toBeGreaterThan(firstZ);
});

test("host snackbar defaults should merge into open options", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "Dense default",
        duration: false,
        transition: "none",
      });
    },
  });

  mount(BridgeSnackbarHost, {
    attachTo: document.body,
    props: {
      snackbar: { dense: true, classes: { root: "host-shell" } },
    },
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  const snackbar = document.body.querySelector('[data-snackbar-part="panel"]');

  expect(snackbar?.className).toContain("host-shell");
});

test("host timeout should auto-dismiss snackbars", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "Timed out",
        transition: "none",
      });
    },
  });

  mount(BridgeSnackbarHost, {
    attachTo: document.body,
    props: { timeout: 50 },
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  expect(document.body.textContent).toContain("Timed out");

  await vi.waitUntil(() => !document.body.textContent?.includes("Timed out"), {
    timeout: 500,
  });
});

test("open duration should override host timeout", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "Persistent",
        transition: "none",
        duration: false,
      });
    },
  });

  mount(BridgeSnackbarHost, {
    attachTo: document.body,
    props: { timeout: 50 },
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();
  await new Promise((resolve) => setTimeout(resolve, 150));
  await flushPromises();

  expect(document.body.textContent).toContain("Persistent");
});

test("max should close the oldest snackbar when the limit is exceeded", async () => {
  const Consumer = defineComponent({
    setup() {
      const snackbar = useBridgeSnackbar();

      snackbar.open({
        title: "One",
        duration: false,
        transition: "none",
      });
      snackbar.open({
        title: "Two",
        duration: false,
        transition: "none",
      });
      snackbar.open({
        title: "Three",
        duration: false,
        transition: "none",
      });
    },
  });

  mount(BridgeSnackbarHost, {
    attachTo: document.body,
    props: { max: 2 },
    slots: { default: () => h(Consumer) },
  });

  await flushPromises();
  await nextTick();

  await vi.waitUntil(() => !document.body.textContent?.includes("One"), {
    timeout: 500,
  });

  expect(document.body.textContent).toContain("Two");
  expect(document.body.textContent).toContain("Three");
});
