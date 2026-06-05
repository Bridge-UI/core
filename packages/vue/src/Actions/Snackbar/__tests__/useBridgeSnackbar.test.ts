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
import { BridgeUIProvider } from "@/Provider";

afterEach(() => {
  document.body.innerHTML = "";
});

function mountWithProvider(child: ReturnType<typeof defineComponent>) {
  return mount(BridgeUIProvider, {
    slots: { default: () => h(child) },
    attachTo: document.body,
  });
}

test("useBridgeSnackbar should throw when BridgeUIProvider is missing", () => {
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
        description: "Changes stored",
        transition: "none",
        duration: false,
      });
    },
  });

  mountWithProvider(Consumer);
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
        title: "Dismiss me",
        transition: "none",
        duration: false,
      });

      snackbar.close(id);
    },
  });

  mount(BridgeSnackbarHost, {
    slots: { default: () => h(Consumer) },
    attachTo: document.body,
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
        transition: "none",
        duration: false,
      });
      snackbar.open({
        title: "Two",
        transition: "none",
        duration: false,
      });

      snackbar.closeAll();
    },
  });

  mountWithProvider(Consumer);
  await flushPromises();
  await nextTick();

  expect(document.body.textContent).not.toContain("One");
  expect(document.body.textContent).not.toContain("Two");
});
