// @vitest-environment happy-dom

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
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
  props: {
    label: {
      type: String,
      default: "Imperative",
    },
  },
  setup(props) {
    return () => h("p", { class: "bridge-modal-body" }, props.label);
  },
});

function mountWithProvider(consumer: ReturnType<typeof defineComponent>) {
  const Root = defineComponent({
    components: { BridgeUIProvider, Consumer: consumer },
    template: "<BridgeUIProvider><Consumer /></BridgeUIProvider>",
  });

  return mount(Root, { attachTo: document.body });
}

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
        modal.open({
          component: Content,
          modal: { size: "sm", transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

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
        const id = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
        });

        await flushPromises();
        bridgeModal.close(id);
        await flushPromises();
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("isOpen and stackSize should reflect mounted entries", async () => {
  let bridgeModal!: ReturnType<typeof useBridgeModal>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useBridgeModal();

      onMounted(() => {
        id = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

  await flushPromises();

  expect(typeof id).toBe("string");
  expect(id.length).toBeGreaterThan(0);
  expect(bridgeModal.isOpen(id)).toBe(true);
  expect(bridgeModal.stackSize).toBe(1);

  bridgeModal.close(id);
  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  expect(bridgeModal.isOpen(id)).toBe(false);
  expect(bridgeModal.stackSize).toBe(0);
});

test("closeTop should close only the topmost imperative modal", async () => {
  let bridgeModal!: ReturnType<typeof useBridgeModal>;
  let outerId = "";
  let innerId = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useBridgeModal();

      onMounted(() => {
        outerId = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
          props: { label: "Outer" },
        });
        innerId = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
          props: { label: "Inner" },
        });
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

  await flushPromises();

  expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(2);

  bridgeModal.closeTop();
  await flushPromises();

  expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  expect(bridgeModal.isOpen(innerId)).toBe(false);
  expect(bridgeModal.isOpen(outerId)).toBe(true);
  expect(bridgeModal.stackSize).toBe(1);
});

test("onClose should run before onClosed when close is called", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let bridgeModal!: ReturnType<typeof useBridgeModal>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useBridgeModal();

      onMounted(() => {
        id = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
          onClose,
          onClosed,
        });
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

  await flushPromises();

  bridgeModal.close(id);
  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );
  expect(onClosed).toHaveBeenCalledOnce();
});

test("onClose should run before onClosed when escape is pressed", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const modal = useBridgeModal();

      onMounted(() => {
        modal.open({
          component: Content,
          modal: { transition: "none" },
          onClose,
          onClosed,
        });
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );
  expect(onClosed).toHaveBeenCalledOnce();
});

test("update should patch props on an open modal", async () => {
  let bridgeModal!: ReturnType<typeof useBridgeModal>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useBridgeModal();

      onMounted(() => {
        id = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
          props: { label: "Before" },
        });
        bridgeModal.update(id, { props: { label: "After" } });
      });

      return () => h("div");
    },
  });

  mountWithProvider(Consumer);

  await flushPromises();

  expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
    "After",
  );
});
