// @vitest-environment happy-dom

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, onMounted } from "vue";

// ** Local Imports
import { BridgeModalHostMissingError, useBridgeModal } from "@/Actions/Modal";
import { BridgeUIProvider } from "@/Provider";
import { resetModalStackForTests } from "@bridge-ui/core";

afterEach(async () => {
  await flushPromises();
  resetModalStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const Content = defineComponent({
  setup() {
    return () => h("p", { class: "bridge-modal-body" }, "Imperative");
  },
});

test("useBridgeModal should throw when BridgeUIProvider is missing", () => {
  const Consumer = defineComponent({
    setup() {
      expect(() => useBridgeModal()).toThrow(BridgeModalHostMissingError);
    },
    template: "<div />",
  });

  mount(Consumer);
});

test("open should return an id and render modal content", async () => {
  const Consumer = defineComponent({
    setup() {
      const modal = useBridgeModal();

      onMounted(() => {
        modal.open({ component: Content, modal: { size: "sm" } });
      });

      return () => h("div");
    },
  });

  const Root = defineComponent({
    components: { BridgeUIProvider, Consumer },
    template: "<BridgeUIProvider><Consumer /></BridgeUIProvider>",
  });

  mount(Root, { attachTo: document.body });

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
    "Imperative",
  );
});

test("close should unmount imperative modal", async () => {
  let bridgeModal!: ReturnType<typeof useBridgeModal>;

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useBridgeModal();

      onMounted(async () => {
        const id = bridgeModal.open({ component: Content });

        await flushPromises();
        bridgeModal.close(id);
        await flushPromises();
      });

      return () => h("div");
    },
  });

  const Root = defineComponent({
    components: { BridgeUIProvider, Consumer },
    template: "<BridgeUIProvider><Consumer /></BridgeUIProvider>",
  });

  mount(Root, { attachTo: document.body });

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("isOpen and stackSize should reflect registry state", async () => {
  let bridgeModal!: ReturnType<typeof useBridgeModal>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useBridgeModal();

      onMounted(() => {
        id = bridgeModal.open({ component: Content });
      });

      return () => h("div");
    },
  });

  const Root = defineComponent({
    components: { BridgeUIProvider, Consumer },
    template: "<BridgeUIProvider><Consumer /></BridgeUIProvider>",
  });

  mount(Root, { attachTo: document.body });

  await flushPromises();

  expect(typeof id).toBe("string");
  expect(id.length).toBeGreaterThan(0);
  expect(bridgeModal.isOpen(id)).toBe(true);
  expect(bridgeModal.stackSize).toBe(1);
});
