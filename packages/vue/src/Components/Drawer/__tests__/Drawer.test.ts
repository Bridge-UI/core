// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { Drawer } from "@/Components/Drawer";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core/Layer";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Drawer>>> = [];

function mountDrawer(options: Parameters<typeof mount<typeof Drawer>>[1] = {}) {
  const wrapper = mount(Drawer, {
    attachTo: document.body,
    ...options,
    props: {
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
  mountDrawer({ props: { modelValue: false } });

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should teleport to body when modelValue is true", () => {
  mountDrawer({
    props: { modelValue: true },
    slots: { default: "Drawer body" },
  });

  const dialog = document.body.querySelector('[role="dialog"]');

  expect(dialog).not.toBeNull();
  expect(document.body.textContent).toContain("Drawer body");
});

test("it should support controlled modelValue without closing when persistent", async () => {
  const wrapper = mountDrawer({
    slots: { default: "Persistent" },
    props: {
      modelValue: true,
      persistent: true,
    },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should not close when clicking inside the panel", async () => {
  const wrapper = mountDrawer({
    props: { modelValue: true },
    slots: { default: '<button type="button">Inner</button>' },
  });

  const inner = [...document.body.querySelectorAll("button")].find((button) => {
    return button.textContent?.includes("Inner");
  });

  await inner?.click();

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should apply size classes on the panel from the placement axis", () => {
  mountDrawer({
    slots: { default: "Sized" },
    props: { size: "lg", modelValue: true },
  });

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("w-96");
});

test("it should apply blur classes on the overlay", () => {
  mountDrawer({
    slots: { default: "Blur" },
    props: { blur: "md", modelValue: true },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  expect(overlay?.className).toContain("backdrop-blur-md");
});

test("it should apply left placement classes by default", () => {
  mountDrawer({
    props: { modelValue: true },
    slots: { default: "Placement" },
  });

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");
  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("h-dvh");
  expect(wrapper?.className).toContain("justify-start");
});

test("it should apply bottom placement classes on the wrapper and panel", () => {
  mountDrawer({
    slots: { default: "Placement" },
    props: { modelValue: true, placement: "bottom" },
  });

  const wrapper = document.body.querySelector(".flex.min-h-full.w-full");
  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("w-full");
  expect(wrapper?.className).toContain("items-end");
});

test("it should render content inside the default slot", () => {
  mountDrawer({
    props: { modelValue: true },
    slots: {
      default: "<div>Drawer content</div>",
    },
  });

  expect(document.body.textContent).toContain("Drawer content");
});

test("it should close on overlay click", async () => {
  const wrapper = mountDrawer({
    props: { modelValue: true, transition: "none" },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should close on wrapper backdrop click", async () => {
  const wrapper = mountDrawer({
    slots: { default: "<div>content</div>" },
    props: { modelValue: true, transition: "none" },
  });

  const el = document.body.querySelector(".flex.min-h-full.w-full");

  const event = new MouseEvent("click", { bubbles: true });

  Object.defineProperty(event, "target", { value: el });
  Object.defineProperty(event, "currentTarget", { value: el });

  el?.dispatchEvent(event);

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should close on escape key", async () => {
  const wrapper = mountDrawer({
    props: { modelValue: true, transition: "none" },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should emit close when closing", async () => {
  const wrapper = mountDrawer({
    props: { modelValue: true, transition: "none" },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("close")).toHaveLength(1);
});

test("it should not close on escape when closeOnEscape is false", async () => {
  const wrapper = mountDrawer({
    props: { modelValue: true, closeOnEscape: false },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should not close on overlay when closeOnOverlay is false", async () => {
  const wrapper = mountDrawer({
    props: { modelValue: true, closeOnOverlay: false },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should render nested drawers with separate dialog layers", () => {
  const App = defineComponent({
    setup() {
      const outer = ref(true);
      const inner = ref(true);

      return () =>
        h(
          Drawer,
          {
            transition: "none",
            modelValue: outer.value,
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Drawer,
              {
                transition: "none",
                modelValue: inner.value,
                "onUpdate:modelValue": (value: boolean) => {
                  inner.value = value;
                },
              },
              () => h("div", "Inner"),
            ),
        );
    },
  });

  const wrapper = mount(App, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(2);
});

test("it should close only the topmost nested drawer on escape", async () => {
  const outer = ref(true);
  const inner = ref(true);

  const App = defineComponent({
    setup() {
      return () =>
        h(
          Drawer,
          {
            transition: "none",
            modelValue: outer.value,
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Drawer,
              {
                transition: "none",
                modelValue: inner.value,
                "onUpdate:modelValue": (value: boolean) => {
                  inner.value = value;
                },
              },
              () => h("div", "Inner"),
            ),
        );
    },
  });

  const wrapper = mount(App, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(outer.value).toBe(true);
  expect(inner.value).toBe(false);
});

test("it should assign incremental z-index to nested drawers", () => {
  const App = defineComponent({
    setup() {
      const outer = ref(true);
      const inner = ref(true);

      return () =>
        h(
          Drawer,
          {
            modelValue: outer.value,
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Drawer,
              {
                modelValue: inner.value,
                "onUpdate:modelValue": (value: boolean) => {
                  inner.value = value;
                },
              },
              () => h("div", "Inner"),
            ),
        );
    },
  });

  const wrapper = mount(App, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  const roots = [
    ...document.body.querySelectorAll<HTMLElement>(
      ".fixed.inset-0.overflow-hidden",
    ),
  ];

  expect(roots).toHaveLength(2);
  expect(Number(roots[0]?.style.zIndex)).toBeLessThan(
    Number(roots[1]?.style.zIndex),
  );
});

test("it should not render backdrop when hideBackdrop is true", () => {
  const wrapper = mountDrawer({
    slots: { default: "No backdrop" },
    props: { modelValue: true, hideBackdrop: true },
  });

  expect(wrapper.props("hideBackdrop")).toBe(true);
  expect(
    document.body.querySelector('[data-drawer-part="overlay"]'),
  ).toBeNull();
});

test("it should skip scroll lock when disableScrollLock is true", () => {
  mountDrawer({
    slots: { default: "Scrollable page" },
    props: { modelValue: true, disableScrollLock: true },
  });

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should keep drawer mounted when keepMounted is true", async () => {
  const wrapper = mountDrawer({
    slots: { default: "Kept" },
    props: {
      modelValue: true,
      keepMounted: true,
      transition: "none",
    },
  });

  await wrapper.setProps({ modelValue: false });
  await flushPromises();

  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
});

test("it should stay open when reopened before the leave transition ends", async () => {
  const onUpdate = vi.fn();

  const wrapper = mount(Drawer, {
    attachTo: document.body,
    slots: { default: "Drawer body" },
    props: {
      modelValue: true,
      transition: "slide",
      "onUpdate:modelValue": onUpdate,
    },
  });

  mountedWrappers.push(wrapper);

  await flushPromises();

  await wrapper.setProps({ modelValue: false });
  await wrapper.setProps({ modelValue: true });
  await flushPromises();

  const panel = document.body.querySelector('[data-drawer-part="panel"]');

  panel?.dispatchEvent(
    new TransitionEvent("transitionend", {
      bubbles: true,
      elapsedTime: 0.3,
      propertyName: "transform",
    }),
  );

  const overlay = document.body.querySelector('[data-drawer-part="overlay"]');

  overlay?.dispatchEvent(
    new TransitionEvent("transitionend", {
      bubbles: true,
      elapsedTime: 0.3,
      propertyName: "opacity",
    }),
  );

  await flushPromises();

  expect(onUpdate).not.toHaveBeenCalledWith(false);
  expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
  expect(document.body.textContent).toContain("Drawer body");
});

test("it should scroll inside panel when scroll is paper", () => {
  mountDrawer({
    slots: { default: "Paper scroll" },
    props: { scroll: "paper", modelValue: true },
  });

  const panel = document.body.querySelector('[role="dialog"]');

  expect(panel?.className).toContain("overflow-y-auto");
});

test("it should scroll on the page when scroll is body", () => {
  mountDrawer({
    slots: { default: "Body scroll" },
    props: { scroll: "body", modelValue: true },
  });

  const root = document.body.querySelector(".fixed.inset-0");

  expect(root?.className).toContain("overflow-y-auto");
});

test("it should assign LAYER_STACK_BASE_Z_INDEX as the base z-index", () => {
  mountDrawer({
    slots: { default: "Base" },
    props: { modelValue: true },
  });

  const root = document.body.querySelector<HTMLElement>(
    ".fixed.inset-0.overflow-hidden",
  );

  expect(Number(root?.style.zIndex)).toBe(LAYER_STACK_BASE_Z_INDEX);
});
