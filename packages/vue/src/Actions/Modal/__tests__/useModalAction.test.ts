// @vitest-environment happy-dom

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, onMounted } from "vue";

// ** Local Imports
import {
  BridgeModalHost,
  BridgeModalHostMissingError,
  useModalAction,
} from "@/Actions/Modal";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core";

afterEach(async () => {
  await flushPromises();
  resetLayerStackForTests();
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

function mountWithModalHost(consumer: ReturnType<typeof defineComponent>) {
  const Root = defineComponent({
    components: { BridgeModalHost, Consumer: consumer },
    template: "<BridgeModalHost><Consumer /></BridgeModalHost>",
  });

  return mount(Root, { attachTo: document.body });
}

test("useModalAction should throw when BridgeModalHost is missing", () => {
  const Consumer = defineComponent({
    setup() {
      expect(() => useModalAction()).toThrow(BridgeModalHostMissingError);
    },
    template: "<div />",
  });

  mount(Consumer);
});

test("open should return an id and render modal content", async () => {
  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();

      onMounted(() => {
        modal.open({
          component: Content,
          modal: { size: "sm", transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
    "Imperative",
  );
});

test("close should unmount imperative modal", async () => {
  let bridgeModal!: ReturnType<typeof useModalAction>;

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

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

  mountWithModalHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("isOpen and stackSize should reflect mounted entries", async () => {
  let bridgeModal!: ReturnType<typeof useModalAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

      onMounted(() => {
        id = bridgeModal.open({
          component: Content,
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

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
  let bridgeModal!: ReturnType<typeof useModalAction>;
  let outerId = "";
  let innerId = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

      onMounted(() => {
        outerId = bridgeModal.open({
          component: Content,
          props: { label: "Outer" },
          modal: { transition: "none" },
        });
        innerId = bridgeModal.open({
          component: Content,
          props: { label: "Inner" },
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

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
  let bridgeModal!: ReturnType<typeof useModalAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

      onMounted(() => {
        id = bridgeModal.open({
          onClose,
          onClosed,
          component: Content,
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

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
      const modal = useModalAction();

      onMounted(() => {
        modal.open({
          onClose,
          onClosed,
          component: Content,
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

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
  let bridgeModal!: ReturnType<typeof useModalAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

      onMounted(() => {
        id = bridgeModal.open({
          component: Content,
          props: { label: "Before" },
          modal: { transition: "none" },
        });
        bridgeModal.update(id, { props: { label: "After" } });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector(".bridge-modal-body")?.textContent).toBe(
    "After",
  );
});

test("update should patch modal shell options on an open modal", async () => {
  let bridgeModal!: ReturnType<typeof useModalAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

      onMounted(() => {
        id = bridgeModal.open({
          component: Content,
          modal: { transition: "none", size: "sm" },
        });
        bridgeModal.update(id, { modal: { size: "lg" } });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("sm:max-w-lg");
});

test("open with persistent modal should ignore escape", async () => {
  const onClose = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();

      onMounted(() => {
        modal.open({
          onClose,
          component: Content,
          modal: { transition: "none", persistent: true },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(onClose).not.toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
});

test("stacked imperative modals should use incremental z-index", async () => {
  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();

      onMounted(() => {
        modal.open({
          component: Content,
          modal: { transition: "none" },
        });
        modal.open({
          component: Content,
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  const zIndexes = [
    ...document.body.querySelectorAll<HTMLElement>(
      ".fixed.inset-0.overflow-y-auto",
    ),
  ]
    .map((root) => Number(root.style.zIndex))
    .sort((left, right) => left - right);

  expect(zIndexes).toEqual([
    LAYER_STACK_BASE_Z_INDEX,
    LAYER_STACK_BASE_Z_INDEX + 1,
  ]);
});

test("onClose should run before onClosed when the overlay is clicked", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let bridgeModal!: ReturnType<typeof useModalAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeModal = useModalAction();

      onMounted(() => {
        id = bridgeModal.open({
          onClose,
          onClosed,
          component: Content,
          modal: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  document.body.querySelector<HTMLElement>('[aria-hidden="true"]')?.click();

  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );
  expect(onClosed).toHaveBeenCalledOnce();
  expect(bridgeModal.isOpen(id)).toBe(false);
});

test("modal shell options must not override host-controlled props", async () => {
  const onClose = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const modal = useModalAction();

      onMounted(() => {
        modal.open({
          onClose,
          component: Content,
          modal: {
            show: false,
            transition: "none",
            onShowChange: vi.fn(),
          },
        });
      });

      return () => h("div");
    },
  });

  mountWithModalHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
});

test("nested BridgeModalHost should warn in development", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  const Root = defineComponent({
    components: { BridgeModalHost },
    template:
      "<BridgeModalHost><BridgeModalHost><span>nested</span></BridgeModalHost></BridgeModalHost>",
  });

  mount(Root);

  await flushPromises();

  expect(warn).toHaveBeenCalledWith(
    "[Bridge UI] Nested <BridgeModalHost /> detected. useModalAction() will target the nearest host only. Remove the extra host.",
  );

  warn.mockRestore();
});
