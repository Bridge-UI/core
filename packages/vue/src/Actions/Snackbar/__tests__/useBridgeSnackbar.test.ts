// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import {
  BridgeSnackbarHost,
  BridgeSnackbarHostMissingError,
  useBridgeSnackbar,
} from "@/Actions/Snackbar";
afterEach(() => {
  document.body.innerHTML = "";
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
