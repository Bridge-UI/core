// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Local Imports
import { Card } from "@/Components/Card";
import { Modal } from "@/Components/Modal";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount<typeof Modal>>> = [];

function mountModal(options: Parameters<typeof mount<typeof Modal>>[1] = {}) {
  let wrapper!: ReturnType<typeof mount<typeof Modal>>;

  wrapper = mount(Modal, {
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
    props: { modelValue: true, align: "start" },
  });

  const wrapper = document.body.querySelector(".mx-auto.flex.min-h-full");

  expect(wrapper?.className).toContain("sm:items-start");
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
  const wrapper = mountModal({ props: { modelValue: true } });

  const overlay = document.body.querySelector(".bg-black\\/50");

  await overlay?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should close on wrapper backdrop click", async () => {
  const wrapper = mountModal({
    props: { modelValue: true },
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
  const wrapper = mountModal({ props: { modelValue: true } });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should call onClose when closing", async () => {
  const onClose = vi.fn();

  mountModal({
    props: { modelValue: true, onClose },
  });

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  expect(onClose).toHaveBeenCalledOnce();
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
