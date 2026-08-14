// @vitest-environment happy-dom

// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { isString } from "es-toolkit/compat";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, onMounted } from "vue";

// ** Local Imports
import {
  BridgeDrawerHost,
  BridgeDrawerHostMissingError,
  useDrawerAction,
} from "@/Actions/Drawer";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core/Layer";

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
    return () => h("p", { class: "bridge-drawer-body" }, props.label);
  },
});

function mountWithDrawerHost(consumer: ReturnType<typeof defineComponent>) {
  const Root = defineComponent({
    components: { BridgeDrawerHost, Consumer: consumer },
    template: "<BridgeDrawerHost><Consumer /></BridgeDrawerHost>",
  });

  return mount(Root, { attachTo: document.body });
}

test("it should throw when BridgeDrawerHost is missing", () => {
  const Consumer = defineComponent({
    template: "<div />",
    setup() {
      expect(() => useDrawerAction()).toThrow(BridgeDrawerHostMissingError);
    },
  });

  mount(Consumer);
});

test("it should return an id and render drawer content", async () => {
  const Consumer = defineComponent({
    setup() {
      const drawer = useDrawerAction();

      onMounted(() => {
        drawer.open({
          component: Content,
          drawer: { size: "sm", transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  expect(document.body.querySelector(".bridge-drawer-body")?.textContent).toBe(
    "Imperative",
  );
});

test("it should unmount imperative drawer", async () => {
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(async () => {
        const id = bridgeDrawer.open({
          component: Content,
          drawer: { transition: "none" },
        });

        await flushPromises();
        bridgeDrawer.close(id);
        await flushPromises();
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should reflect mounted entries", async () => {
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(() => {
        id = bridgeDrawer.open({
          component: Content,
          drawer: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  expect(isString(id)).toBe(true);
  expect(id.length).toBeGreaterThan(0);
  expect(bridgeDrawer.stackSize).toBe(1);
  expect(bridgeDrawer.isOpen(id)).toBe(true);

  bridgeDrawer.close(id);
  await flushPromises();

  expect(bridgeDrawer.stackSize).toBe(0);
  expect(bridgeDrawer.isOpen(id)).toBe(false);
  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should close only the topmost imperative drawer", async () => {
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;
  let outerId = "";
  let innerId = "";

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(() => {
        outerId = bridgeDrawer.open({
          component: Content,
          props: { label: "Outer" },
          drawer: { transition: "none" },
        });
        innerId = bridgeDrawer.open({
          component: Content,
          props: { label: "Inner" },
          drawer: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(2);

  bridgeDrawer.closeTop();
  await flushPromises();

  expect(bridgeDrawer.stackSize).toBe(1);
  expect(bridgeDrawer.isOpen(outerId)).toBe(true);
  expect(bridgeDrawer.isOpen(innerId)).toBe(false);
  expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(1);
});

test("it should run before onClosed when close is called", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(() => {
        id = bridgeDrawer.open({
          onClose,
          onClosed,
          component: Content,
          drawer: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  bridgeDrawer.close(id);
  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClosed).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );
});

test("it should run before onClosed when escape is pressed", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const drawer = useDrawerAction();

      onMounted(() => {
        drawer.open({
          onClose,
          onClosed,
          component: Content,
          drawer: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClosed).toHaveBeenCalledOnce();
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );
});

test("it should patch props on an open drawer", async () => {
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(() => {
        id = bridgeDrawer.open({
          component: Content,
          props: { label: "Before" },
          drawer: { transition: "none" },
        });
        bridgeDrawer.update(id, { props: { label: "After" } });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector(".bridge-drawer-body")?.textContent).toBe(
    "After",
  );
});

test("it should patch drawer shell options on an open drawer", async () => {
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(() => {
        id = bridgeDrawer.open({
          component: Content,
          drawer: { size: "sm", transition: "none" },
        });
        bridgeDrawer.update(id, { drawer: { size: "lg" } });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("w-96");
});

test("it should ignore escape", async () => {
  const onClose = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const drawer = useDrawerAction();

      onMounted(() => {
        drawer.open({
          onClose,
          component: Content,
          drawer: { persistent: true, transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(onClose).not.toHaveBeenCalled();
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should use incremental z-index", async () => {
  const Consumer = defineComponent({
    setup() {
      const drawer = useDrawerAction();

      onMounted(() => {
        drawer.open({
          component: Content,
          drawer: { transition: "none" },
        });
        drawer.open({
          component: Content,
          drawer: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  const zIndexes = [
    ...document.body.querySelectorAll<HTMLElement>(
      '.fixed.inset-0[style*="z-index"]',
    ),
  ]
    .map((root) => Number(root.style.zIndex))
    .sort((left, right) => left - right);

  expect(zIndexes).toEqual([
    LAYER_STACK_BASE_Z_INDEX,
    LAYER_STACK_BASE_Z_INDEX + 1,
  ]);
});

test("it should run before onClosed when the overlay is clicked", async () => {
  const onClose = vi.fn();
  const onClosed = vi.fn();
  let bridgeDrawer!: ReturnType<typeof useDrawerAction>;
  let id = "";

  const Consumer = defineComponent({
    setup() {
      bridgeDrawer = useDrawerAction();

      onMounted(() => {
        id = bridgeDrawer.open({
          onClose,
          onClosed,
          component: Content,
          drawer: { transition: "none" },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  document.body.querySelector<HTMLElement>('[aria-hidden="true"]')?.click();

  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
  expect(onClosed).toHaveBeenCalledOnce();
  expect(bridgeDrawer.isOpen(id)).toBe(false);
  expect(onClose.mock.invocationCallOrder[0]).toBeLessThan(
    onClosed.mock.invocationCallOrder[0] ?? Number.MAX_SAFE_INTEGER,
  );
});

test("it should not override host-controlled props with drawer shell options", async () => {
  const onClose = vi.fn();

  const Consumer = defineComponent({
    setup() {
      const drawer = useDrawerAction();

      onMounted(() => {
        drawer.open({
          onClose,
          component: Content,
          drawer: {
            show: false,
            transition: "none",
          },
        });
      });

      return () => h("div");
    },
  });

  mountWithDrawerHost(Consumer);

  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(onClose).toHaveBeenCalledOnce();
});

test("it should warn in development", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

  const Root = defineComponent({
    components: { BridgeDrawerHost },
    template:
      "<BridgeDrawerHost><BridgeDrawerHost><span>nested</span></BridgeDrawerHost></BridgeDrawerHost>",
  });

  mount(Root);

  await flushPromises();

  expect(warn).toHaveBeenCalledWith(
    "[Bridge UI] Nested <BridgeDrawerHost /> detected. useDrawerAction() will target the nearest host only. Remove the extra host.",
  );

  warn.mockRestore();
});
