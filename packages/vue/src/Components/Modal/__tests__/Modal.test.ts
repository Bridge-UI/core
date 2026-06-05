// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { Card } from "@/Components/Card";
import { Modal } from "@/Components/Modal";
import {
  LAYER_STACK_BASE_Z_INDEX,
  resetLayerStackForTests,
} from "@bridge-ui/core";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Modal>>> = [];

function mountModal(options: Parameters<typeof mount<typeof Modal>>[1] = {}) {
  const wrapper = mount(Modal, {
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
  mountModal({ props: { modelValue: false } });

  expect(document.body.querySelector('[role="dialog"]')).toBeNull();
});

test("it should teleport to body when modelValue is true", () => {
  mountModal({
    props: { modelValue: true },
    slots: { default: "Modal body" },
  });

  const dialog = document.body.querySelector('[role="dialog"]');

  expect(dialog).not.toBeNull();
  expect(document.body.textContent).toContain("Modal body");
});

test("it should support controlled modelValue without closing when persistent", async () => {
  const wrapper = mountModal({
    props: {
      modelValue: true,
      persistent: true,
    },
    slots: { default: "Persistent" },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should not close when clicking inside the panel", async () => {
  const wrapper = mountModal({
    props: { modelValue: true },
    slots: { default: '<button type="button">Inner</button>' },
  });

  const inner = [...document.body.querySelectorAll("button")].find((button) => {
    return button.textContent?.includes("Inner");
  });

  await inner?.click();

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should apply size classes on the wrapper from sm breakpoint", () => {
  mountModal({
    slots: { default: "Sized" },
    props: { modelValue: true, size: "lg" },
  });

  const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

  expect(wrapper?.className).toContain("sm:max-w-lg");
});

test("it should apply blur classes on the overlay", () => {
  mountModal({
    slots: { default: "Blur" },
    props: { modelValue: true, blur: "md" },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  expect(overlay?.className).toContain("backdrop-blur-md");
});

test("it should apply align classes on the wrapper", () => {
  mountModal({
    slots: { default: "Align" },
    props: { modelValue: true, align: "top-start" },
  });

  const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

  expect(wrapper?.className).toContain("sm:items-start");
  expect(wrapper?.className).toContain("sm:justify-start");
});

test("it should apply middle-end align classes on the wrapper", () => {
  mountModal({
    slots: { default: "Align" },
    props: { modelValue: true, align: "middle-end" },
  });

  const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

  expect(wrapper?.className).toContain("sm:justify-end");
  expect(wrapper?.className).toContain("sm:items-center");
});

test("it should render a Card inside the default slot", () => {
  mountModal({
    props: { modelValue: true },
    slots: {
      default: {
        components: { Card },
        template: '<Card title="In modal">Body</Card>',
      },
    },
  });

  expect(document.body.textContent).toContain("Body");
  expect(document.body.textContent).toContain("In modal");
});

test("it should close on overlay click", async () => {
  const wrapper = mountModal({
    props: { modelValue: true, transition: "none" },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should close on wrapper backdrop click", async () => {
  const wrapper = mountModal({
    props: { modelValue: true, transition: "none" },
    slots: { default: "<div>content</div>" },
  });

  const el = document.body.querySelector(".mx-auto.flex.min-h-full");

  const event = new MouseEvent("click", { bubbles: true });

  Object.defineProperty(event, "target", { value: el });
  Object.defineProperty(event, "currentTarget", { value: el });

  el?.dispatchEvent(event);

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should close on escape key", async () => {
  const wrapper = mountModal({
    props: { modelValue: true, transition: "none" },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should emit close when closing", async () => {
  const wrapper = mountModal({
    props: { modelValue: true, transition: "none" },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("close")).toHaveLength(1);
});

test("it should not close on escape when closeOnEscape is false", async () => {
  const wrapper = mountModal({
    props: { modelValue: true, closeOnEscape: false },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should not close on overlay when closeOnOverlay is false", async () => {
  const wrapper = mountModal({
    props: { modelValue: true, closeOnOverlay: false },
  });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toBeUndefined();
});

test("it should render nested modals with separate dialog layers", () => {
  const App = defineComponent({
    setup() {
      const outer = ref(true);
      const inner = ref(true);

      return () =>
        h(
          Modal,
          {
            modelValue: outer.value,
            transition: "none",
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Modal,
              {
                modelValue: inner.value,
                transition: "none",
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

test("it should close only the topmost nested modal on escape", async () => {
  const outer = ref(true);
  const inner = ref(true);

  const App = defineComponent({
    setup() {
      return () =>
        h(
          Modal,
          {
            modelValue: outer.value,
            transition: "none",
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Modal,
              {
                modelValue: inner.value,
                transition: "none",
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

  expect(inner.value).toBe(false);
  expect(outer.value).toBe(true);
});

test("it should keep body scroll locked when an inner modal closes", async () => {
  const outer = ref(true);
  const inner = ref(true);

  const App = defineComponent({
    setup() {
      return () =>
        h(
          Modal,
          {
            modelValue: outer.value,
            transition: "none",
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Modal,
              {
                modelValue: inner.value,
                transition: "none",
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

  expect(document.body.style.overflow).toBe("hidden");

  inner.value = false;

  await flushPromises();

  expect(outer.value).toBe(true);
  expect(document.body.style.overflow).toBe("hidden");
});

test("it should assign incremental z-index to nested modals", () => {
  const App = defineComponent({
    setup() {
      const outer = ref(true);
      const inner = ref(true);

      return () =>
        h(
          Modal,
          {
            modelValue: outer.value,
            "onUpdate:modelValue": (value: boolean) => {
              outer.value = value;
            },
          },
          () =>
            h(
              Modal,
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
      ".fixed.inset-0.overflow-y-auto",
    ),
  ];

  expect(roots).toHaveLength(2);
  expect(Number(roots[0]?.style.zIndex)).toBeLessThan(
    Number(roots[1]?.style.zIndex),
  );
});

test("it should refresh z-index when a sibling modal unmounts", async () => {
  const outer = ref(true);
  const middle = ref(true);
  const inner = ref(true);

  const App = defineComponent({
    setup() {
      return () =>
        h("div", [
          h(
            Modal,
            {
              modelValue: outer.value,
              transition: "none",
              "onUpdate:modelValue": (value: boolean) => {
                outer.value = value;
              },
            },
            () => "Outer",
          ),
          h(
            Modal,
            {
              modelValue: middle.value,
              transition: "none",
              "onUpdate:modelValue": (value: boolean) => {
                middle.value = value;
              },
            },
            () => "Middle",
          ),
          h(
            Modal,
            {
              modelValue: inner.value,
              transition: "none",
              "onUpdate:modelValue": (value: boolean) => {
                inner.value = value;
              },
            },
            () => "Inner",
          ),
        ]);
    },
  });

  const wrapper = mount(App, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  await flushPromises();

  expect(document.body.querySelectorAll('[role="dialog"]')).toHaveLength(3);

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  await flushPromises();

  expect(inner.value).toBe(false);

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
