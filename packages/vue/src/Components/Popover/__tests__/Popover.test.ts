// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { Button } from "@/Components/Button";
import { Menu } from "@/Components/Menu";
import { Popover } from "@/Components/Popover";

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function mountPopover(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(Popover, {
    attachTo: document.body,
    ...options,
    slots: {
      default: () => "Popover body",
      trigger: () => h(Button, null, () => "Open"),
      ...(options.slots ?? {}),
    },
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

function getDialog() {
  return document.body.querySelector<HTMLElement>('[role="dialog"]');
}

function getTrigger() {
  return document.body.querySelector<HTMLElement>('[aria-haspopup="dialog"]');
}

async function flushFrame() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await flushPromises();
}

test("it should open the popover when the trigger is clicked", async () => {
  const wrapper = mountPopover({ props: { modelValue: false } });

  expect(getDialog()).toBeNull();

  await wrapper.find("button").trigger("click");
  await flushPromises();

  expect(getDialog()?.textContent).toContain("Popover body");
});

test("it should close the popover when the trigger is clicked again", async () => {
  const wrapper = mountPopover({ props: { modelValue: false } });

  await wrapper.find("button").trigger("click");
  await flushPromises();
  await wrapper.find("button").trigger("click");
  await flushPromises();

  expect(getDialog()).toBeNull();
});

test("it should expose dialog semantics on the trigger", async () => {
  mountPopover({ props: { modelValue: true } });
  await flushPromises();

  expect(getTrigger()?.getAttribute("aria-expanded")).toBe("true");
  expect(getTrigger()?.getAttribute("aria-controls")).toBe(getDialog()?.id);
});

test("it should label the dialog with the title prop", async () => {
  mountPopover({ props: { modelValue: true, title: "Filters" } });
  await flushPromises();

  const labelId = getDialog()?.getAttribute("aria-labelledby");

  expect(labelId).toBeTruthy();
  expect(document.getElementById(labelId ?? "")?.textContent).toBe("Filters");
});

test("it should label the dialog with the title slot", async () => {
  mountPopover({
    props: { modelValue: true },
    slots: { title: () => "Slot title" },
  });
  await flushPromises();

  const labelId = getDialog()?.getAttribute("aria-labelledby");

  expect(document.getElementById(labelId ?? "")?.textContent).toBe(
    "Slot title",
  );
});

test("it should not trap arrow keys inside the content", async () => {
  mountPopover({
    props: { modelValue: true },
    slots: { default: () => h("input", { "aria-label": "Name" }) },
  });
  await flushPromises();

  const input = document.body.querySelector("input");
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    key: "ArrowDown",
    cancelable: true,
  });

  input?.dispatchEvent(event);

  expect(event.defaultPrevented).toBe(false);
});

test("it should close on click away and emit close", async () => {
  const wrapper = mountPopover({ props: { modelValue: true } });
  await flushFrame();

  document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();

  expect(getDialog()).toBeNull();
  expect(wrapper.emitted("close")).toHaveLength(1);
});

test("it should stay open on click away when closeOnClickAway is false", async () => {
  mountPopover({ props: { modelValue: true, closeOnClickAway: false } });
  await flushFrame();

  document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();

  expect(getDialog()).not.toBeNull();
});

test("it should stay open when clicking inside a layer opened from it", async () => {
  const menuOpen = ref(false);

  mountPopover({
    props: { modelValue: true },
    slots: {
      default: () =>
        h(
          Menu,
          {
            modelValue: menuOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              menuOpen.value = value;
            },
          },
          {
            trigger: () => h(Button, null, () => "Nested"),
            default: () => h("span", { id: "nested-item" }, "Nested item"),
          },
        ),
    },
  });
  await flushPromises();

  const nestedTrigger = Array.from(
    document.body.querySelectorAll("button"),
  ).find((button) => button.textContent === "Nested");

  nestedTrigger?.click();
  await flushFrame();

  document
    .getElementById("nested-item")
    ?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();

  expect(getDialog()).not.toBeNull();
  expect(document.body.querySelector('[role="menu"]')).not.toBeNull();
});

test("it should close on Escape and return focus to the trigger", async () => {
  mountPopover({ props: { modelValue: true } });
  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(getDialog()).toBeNull();
  expect(document.activeElement).toBe(getTrigger());
});

test("it should stay open on Escape when closeOnEscape is false", async () => {
  mountPopover({ props: { modelValue: true, closeOnEscape: false } });
  await flushPromises();

  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(getDialog()).not.toBeNull();
});

test("it should close when focus moves outside", async () => {
  const outside = document.createElement("button");

  document.body.appendChild(outside);

  mountPopover({ props: { modelValue: true } });
  await flushPromises();

  getDialog()?.dispatchEvent(
    new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
  );
  await flushPromises();

  expect(getDialog()).toBeNull();
});

test("it should stay open when focus moves inside the content", async () => {
  mountPopover({
    props: { modelValue: true },
    slots: { default: () => h("input", { "aria-label": "Name" }) },
  });
  await flushPromises();

  getDialog()?.dispatchEvent(
    new FocusEvent("focusout", {
      bubbles: true,
      relatedTarget: document.body.querySelector("input"),
    }),
  );
  await flushPromises();

  expect(getDialog()).not.toBeNull();
});

test("it should not close on dismiss when persistent", async () => {
  mountPopover({ props: { modelValue: true, persistent: true } });
  await flushFrame();

  document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
  await flushPromises();

  expect(getDialog()).not.toBeNull();
});

test("it should close from the content with the default slot close", async () => {
  mountPopover({
    props: { modelValue: true, persistent: true },
    slots: {
      default: ({ close }: { close: () => void }) =>
        h("button", { id: "done", type: "button", onClick: close }, "Done"),
    },
  });
  await flushPromises();

  document.getElementById("done")?.click();
  await flushPromises();

  expect(getDialog()).toBeNull();
});

test("it should close an open menu when it opens", async () => {
  const menuOpen = ref(true);
  const popoverOpen = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h("div", [
          h(
            Menu,
            {
              modelValue: menuOpen.value,
              "onUpdate:modelValue": (value: boolean) => {
                menuOpen.value = value;
              },
            },
            {
              default: () => "Menu body",
              trigger: () => h(Button, null, () => "Menu"),
            },
          ),
          h(
            Popover,
            {
              modelValue: popoverOpen.value,
              "onUpdate:modelValue": (value: boolean) => {
                popoverOpen.value = value;
              },
            },
            {
              default: () => "Popover body",
              trigger: () => h(Button, null, () => "Open"),
            },
          ),
        ]);
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  const open = wrapper.findAll("button").find((b) => b.text() === "Open");

  await open?.trigger("pointerdown");
  await open?.trigger("click");
  await flushPromises();

  expect(getDialog()).not.toBeNull();
  expect(menuOpen.value).toBe(false);
});

test("it should render the arrow when arrow is true", async () => {
  mountPopover({
    props: { arrow: true, modelValue: true, classes: { arrow: "the-arrow" } },
  });
  await flushPromises();

  expect(getDialog()?.querySelector(".the-arrow")).not.toBeNull();
});

test("it should anchor to anchorEl without a trigger slot", async () => {
  const anchor = document.createElement("button");

  document.body.appendChild(anchor);

  const wrapper = mount(Popover, {
    attachTo: document.body,
    slots: { default: () => "Anchored body" },
    props: { modelValue: true, anchorEl: anchor },
  });

  mountedWrappers.push(wrapper);
  await flushPromises();

  expect(getDialog()?.textContent).toContain("Anchored body");
  expect(getTrigger()).toBeNull();
});

test("it should keep the parent menu open when opened from inside it", async () => {
  const menuOpen = ref(true);
  const popoverOpen = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Menu,
          {
            modelValue: menuOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              menuOpen.value = value;
            },
          },
          {
            trigger: () => h(Button, null, () => "Menu"),
            default: () =>
              h(
                Popover,
                {
                  modelValue: popoverOpen.value,
                  "onUpdate:modelValue": (value: boolean) => {
                    popoverOpen.value = value;
                  },
                },
                {
                  default: () => "Nested popover",
                  trigger: () => h(Button, null, () => "Nested"),
                },
              ),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  const nested = Array.from(document.body.querySelectorAll("button")).find(
    (button) => button.textContent === "Nested",
  );

  nested?.click();
  await flushFrame();

  expect(menuOpen.value).toBe(true);
  expect(getDialog()?.textContent).toContain("Nested popover");
});

test("it should return focus to the trigger when closed from the content", async () => {
  mountPopover({
    props: { modelValue: true },
    slots: {
      default: ({ close }: { close: () => void }) =>
        h("button", { id: "done", type: "button", onClick: close }, "Done"),
    },
  });
  await flushPromises();

  const done = document.getElementById("done");

  done?.focus();
  done?.click();
  await flushPromises();

  expect(getDialog()).toBeNull();
  expect(document.activeElement).toBe(getTrigger());
});

test("it should stay open when focus moves outside and closeOnFocusOut is false", async () => {
  const outside = document.createElement("button");

  document.body.appendChild(outside);

  mountPopover({ props: { modelValue: true, closeOnFocusOut: false } });
  await flushPromises();

  getDialog()?.dispatchEvent(
    new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
  );
  await flushPromises();

  expect(getDialog()).not.toBeNull();
});
