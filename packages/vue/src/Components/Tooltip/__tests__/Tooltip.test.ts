// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Tooltip } from "@/Components/Tooltip";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountTooltip(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(Tooltip, {
    attachTo: document.body,
    ...options,
    props: {
      ...(options.props ?? {}),
      "onUpdate:modelValue": (value: boolean) => {
        void wrapper.setProps({ modelValue: value });
      },
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

test("it should not show the tooltip by default", () => {
  mountTooltip({
    props: { content: "Save file" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
});

test("it should open on pointer enter when openDelay is 0", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "Save file" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  await flushPromises();

  expect(
    document.body.querySelector('[role="tooltip"]')?.textContent,
  ).toContain("Save file");
});

test("it should open after openDelay", async () => {
  vi.useFakeTimers();

  const wrapper = mountTooltip({
    props: { openDelay: 200, content: "Delayed" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();

  vi.advanceTimersByTime(200);
  await flushPromises();

  expect(
    document.body.querySelector('[role="tooltip"]')?.textContent,
  ).toContain("Delayed");
});

test("it should close on pointer leave", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "Save file" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  const trigger = wrapper.find(".inline-flex.w-fit");

  await trigger.trigger("pointerenter");
  await flushPromises();
  expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull();

  await trigger.trigger("pointerleave");
  await flushPromises();

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
});

test("it should set aria-describedby on the trigger while open", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "Save file" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  const trigger = wrapper.find(".inline-flex.w-fit");

  await trigger.trigger("pointerenter");
  await flushPromises();

  const tooltip = document.body.querySelector('[role="tooltip"]');

  expect(trigger.attributes("aria-describedby")).toBe(tooltip?.id);
});

test("it should respect controlled modelValue", async () => {
  const open = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Tooltip,
          {
            content: "Controlled",
            modelValue: open.value,
            "onUpdate:modelValue": (value: boolean) => {
              open.value = value;
            },
          },
          {
            trigger: () => h(Button, null, () => "Save"),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();

  open.value = true;
  await nextTick();
  await flushPromises();

  expect(
    document.body.querySelector('[role="tooltip"]')?.textContent,
  ).toContain("Controlled");
});

test("it should position with anchorEl when provided", async () => {
  const Host = defineComponent({
    setup() {
      const anchor = ref<null | HTMLElement>(null);

      return () =>
        h("div", [
          h(
            "button",
            {
              ref: (el: unknown) => {
                anchor.value = el as HTMLElement;
              },
            },
            "Anchor",
          ),
          h(Tooltip, {
            modelValue: true,
            content: "From anchor",
            anchorEl: anchor.value,
          }),
        ]);
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await nextTick();
  await flushPromises();

  expect(
    document.body.querySelector('[role="tooltip"]')?.textContent,
  ).toContain("From anchor");
});

test("it should not open when disabled", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, disabled: true, content: "Hidden" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  await flushPromises();

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
});

test("it should render the arrow by default", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "With arrow" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  await flushPromises();

  const arrow = document.body.querySelector(
    '[role="tooltip"] [aria-hidden="true"]',
  );

  expect(arrow).not.toBeNull();
  expect(arrow?.classList.contains("rotate-45")).toBe(true);
});

test("it should omit the arrow when arrow is false", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, arrow: false, content: "No arrow" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  await flushPromises();

  expect(
    document.body.querySelector('[role="tooltip"] [aria-hidden="true"]'),
  ).toBeNull();
});

test("it should close on Escape", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "Escapable" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  const trigger = wrapper.find(".inline-flex.w-fit");

  await trigger.trigger("pointerenter");
  await flushPromises();
  expect(document.body.querySelector('[role="tooltip"]')).not.toBeNull();

  await trigger.trigger("keydown", { key: "Escape" });
  await flushPromises();

  expect(document.body.querySelector('[role="tooltip"]')).toBeNull();
});

test("it should apply dark content color by default", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "Dark" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  await flushPromises();

  expect(
    document.body
      .querySelector('[role="tooltip"]')
      ?.classList.contains("bg-dark-900"),
  ).toBe(true);
});

test("it should prefer default slot over content prop", async () => {
  const wrapper = mountTooltip({
    props: { openDelay: 0, content: "Plain text" },
    slots: {
      trigger: () => h(Button, null, () => "Save"),
      default: () => h("span", { "data-testid": "custom-body" }, "Custom body"),
    },
  });

  await wrapper.find(".inline-flex.w-fit").trigger("pointerenter");
  await flushPromises();

  expect(
    document.body.querySelector('[data-testid="custom-body"]')?.textContent,
  ).toBe("Custom body");
  expect(
    document.body.querySelector('[role="tooltip"]')?.textContent,
  ).not.toContain("Plain text");
});
