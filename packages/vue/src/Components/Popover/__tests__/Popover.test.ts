// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";
import { createSSRApp, defineComponent, h, ref, type App } from "vue";
import { renderToString } from "vue/server-renderer";

// ** Core Imports
import {
  getLayerStackSnapshot,
  pushLayerStack,
  resetLayerStackForTests,
} from "@bridge-ui/core/Layer";

// ** Local Imports
import { Button } from "@/Components/Button";
import { DateField } from "@/Components/DateField";
import { Menu } from "@/Components/Menu";
import { Modal } from "@/Components/Modal";
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

test("it should not move focus back to the trigger on click away", async () => {
  const outside = document.createElement("span");

  document.body.appendChild(outside);

  mountPopover({
    props: { modelValue: true },
    slots: { default: () => h("input", { "aria-label": "Name" }) },
  });
  await flushFrame();

  let triggerFocused = 0;

  getTrigger()?.addEventListener("focus", () => {
    triggerFocused += 1;
  });

  expect(document.activeElement?.getAttribute("aria-label")).toBe("Name");

  outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();

  expect(getDialog()).toBeNull();
  expect(triggerFocused).toBe(0);
});

test("it should close the parent popover when focus leaves a nested one", async () => {
  const outerOpen = ref(true);
  const innerOpen = ref(true);
  const outside = document.createElement("button");

  document.body.appendChild(outside);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Popover,
          {
            modelValue: outerOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              outerOpen.value = value;
            },
          },
          {
            trigger: () => h(Button, null, () => "Outer"),
            default: () =>
              h(
                Popover,
                {
                  modelValue: innerOpen.value,
                  "onUpdate:modelValue": (value: boolean) => {
                    innerOpen.value = value;
                  },
                },
                {
                  trigger: () => h(Button, null, () => "Inner"),
                  default: () => h("input", { "aria-label": "Inner field" }),
                },
              ),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  document.body
    .querySelector('[aria-label="Inner field"]')
    ?.dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
    );
  await flushPromises();

  expect(innerOpen.value).toBe(false);
  expect(outerOpen.value).toBe(false);
});

test("it should restore focus on a later close when the parent ignored click away", async () => {
  const outside = document.createElement("span");

  document.body.appendChild(outside);

  const wrapper = mount(Popover, {
    attachTo: document.body,
    props: { modelValue: true, "onUpdate:modelValue": () => {} },
    slots: {
      trigger: () => h(Button, null, () => "Open"),
      default: () => h("input", { "aria-label": "Name" }),
    },
  });

  mountedWrappers.push(wrapper);
  await flushFrame();

  outside.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 0));
  await flushPromises();

  expect(getDialog()).not.toBeNull();

  await wrapper.setProps({ modelValue: false });

  expect(getDialog()).toBeNull();
  expect(document.activeElement).toBe(getTrigger());
});

test("it should stay open when focus leaves the anchor input", async () => {
  const anchor = document.createElement("input");
  const outside = document.createElement("button");

  document.body.append(anchor, outside);

  const wrapper = mount(Popover, {
    attachTo: document.body,
    slots: { default: () => "Suggestions" },
    props: { modelValue: true, anchorEl: anchor, disableAutoFocus: true },
  });

  mountedWrappers.push(wrapper);
  await flushFrame();

  anchor.dispatchEvent(
    new FocusEvent("focusout", { bubbles: true, relatedTarget: outside }),
  );
  await flushPromises();

  expect(getDialog()).not.toBeNull();
});

function mountMenu(props: Record<string, unknown> = {}) {
  const wrapper = mount(Menu, {
    attachTo: document.body,
    props: { modelValue: true, ...props },
    slots: {
      trigger: () => h(Button, null, () => "Menu"),
      default: () => h("button", { type: "button" }, "Item"),
    },
  });

  mountedWrappers.push(wrapper);

  return wrapper;
}

function getButton(text: string) {
  return Array.from(document.body.querySelectorAll("button")).find(
    (button) => button.textContent === text,
  );
}

test("it should close a menu from a toggle button inside the anchor", async () => {
  const open = ref(true);
  const anchor = ref<null | HTMLElement>(null);

  const Host = defineComponent({
    setup() {
      return () => [
        h("div", { ref: anchor }, [
          h(
            "button",
            {
              type: "button",
              onClick: () => {
                open.value = !open.value;
              },
            },
            "Toggle",
          ),
        ]),
        h(
          Menu,
          {
            anchorEl: anchor.value,
            modelValue: open.value,
            "onUpdate:modelValue": (value: boolean) => {
              open.value = value;
            },
          },
          { default: () => h("button", { type: "button" }, "Item") },
        ),
      ];
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  const toggle = getButton("Toggle");

  toggle?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();
  toggle?.click();
  await flushPromises();

  expect(open.value).toBe(false);
});

test("it should unmount the hidden panel when keepMounted turns off", async () => {
  const wrapper = mountPopover({
    props: { modelValue: true, keepMounted: true },
  });

  await flushPromises();
  await wrapper.setProps({ modelValue: false });

  expect(getDialog()).not.toBeNull();

  await wrapper.setProps({ keepMounted: false });

  expect(getDialog()).toBeNull();
});

test("it should close a menu from a plain button outside it", async () => {
  const save = document.createElement("button");

  document.body.appendChild(save);

  const wrapper = mountMenu();

  await flushFrame();

  save.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();

  expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([false]);
});

test("it should honor closeOnEscape when Escape is pressed inside the menu", async () => {
  const wrapper = mountMenu({ closeOnEscape: false });

  await flushFrame();

  getButton("Item")?.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
  );
  await flushPromises();

  expect(wrapper.emitted("close")).toBeUndefined();
});

test("it should emit close once when Escape is pressed inside the menu", async () => {
  const wrapper = mountMenu();

  await flushFrame();

  getButton("Item")?.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
  );
  await flushPromises();

  expect(wrapper.emitted("close")).toHaveLength(1);
});

test("it should close when focus leaves through the trigger", async () => {
  const before = document.createElement("button");

  document.body.appendChild(before);

  mountPopover({ props: { modelValue: true } });
  await flushFrame();

  getButton("Open")?.dispatchEvent(
    new FocusEvent("focusout", { bubbles: true, relatedTarget: before }),
  );
  await flushPromises();

  expect(getDialog()).toBeNull();
});

test("it should close when focus moves into an unrelated layer and then out", async () => {
  const opener = document.createElement("button");
  const panel = document.createElement("div");
  const field = document.createElement("input");

  panel.append(field);
  document.body.append(opener, panel);

  mountPopover({
    props: { modelValue: true },
    slots: { default: () => h("input", { "aria-label": "Name" }) },
  });
  await flushFrame();

  const layer = pushLayerStack({ container: panel, origin: () => opener });

  field.dispatchEvent(
    new FocusEvent("focusout", { bubbles: true, relatedTarget: opener }),
  );
  await flushPromises();

  expect(getDialog()).not.toBeNull();

  document.body
    .querySelector('[aria-label="Name"]')
    ?.dispatchEvent(
      new FocusEvent("focusout", { bubbles: true, relatedTarget: field }),
    );
  await flushPromises();

  expect(getDialog()).toBeNull();

  layer.release();
});

test("it should return focus to the trigger when click away does not move it", async () => {
  const canvas = document.createElement("canvas");

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
  });
  document.body.appendChild(canvas);

  mountPopover({
    props: { modelValue: true, keepMounted: true },
    slots: { default: () => h("input", { "aria-label": "Name" }) },
  });
  await flushFrame();

  expect(document.activeElement?.getAttribute("aria-label")).toBe("Name");

  canvas.dispatchEvent(
    new Event("pointerdown", { bubbles: true, cancelable: true }),
  );
  await flushPromises();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(document.activeElement).toBe(getTrigger());
});

/**
 * Renders `app` the way a server does: without `document`.
 */
async function renderOnServer(app: App) {
  vi.stubGlobal("document", undefined);

  try {
    const html = await renderToString(app);

    // Tasks scheduled during setup (nextTick) must not touch the DOM either.
    await flushPromises();

    return html;
  } finally {
    vi.unstubAllGlobals();
  }
}

test("it should render an open popover on the server", async () => {
  const app = createSSRApp({
    render: () =>
      h(
        Popover,
        { modelValue: true, teleportTo: false },
        {
          default: () => "Popover body",
          trigger: () => h("button", { type: "button" }, "Open"),
        },
      ),
  });

  await expect(renderOnServer(app)).resolves.toContain("Popover body");
  expect(getLayerStackSnapshot()).toHaveLength(0);
});

test("it should render an open menu on the server", async () => {
  const app = createSSRApp({
    render: () =>
      h(
        Menu,
        { modelValue: true, teleportTo: false },
        {
          default: () => "Menu body",
          trigger: () => h("button", { type: "button" }, "Open"),
        },
      ),
  });

  await expect(renderOnServer(app)).resolves.toContain("Menu body");
  expect(getLayerStackSnapshot()).toHaveLength(0);
});

test("it should apply customProps.content without a trigger slot", async () => {
  const wrapper = mount(Popover, {
    attachTo: document.body,
    slots: { default: () => "Body" },
    props: {
      modelValue: true,
      classes: { content: "custom-panel" },
      customProps: { content: { "data-testid": "filters" } },
    },
  });

  mountedWrappers.push(wrapper);
  await flushPromises();

  const dialog = document.body.querySelector<HTMLElement>(
    '[data-testid="filters"]',
  );

  expect(dialog?.getAttribute("role")).toBe("dialog");
  expect(dialog?.className).toContain("custom-panel");
});

test("it should keep the outer menu open when a menu opens inside its popover", async () => {
  const outerOpen = ref(true);
  const popoverOpen = ref(true);
  const innerOpen = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Menu,
          {
            modelValue: outerOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              outerOpen.value = value;
            },
          },
          {
            trigger: () => h(Button, null, () => "Outer"),
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
                  trigger: () => h(Button, null, () => "Details"),
                  default: () =>
                    h(
                      Menu,
                      {
                        modelValue: innerOpen.value,
                        "onUpdate:modelValue": (value: boolean) => {
                          innerOpen.value = value;
                        },
                      },
                      {
                        trigger: () => h(Button, null, () => "Inner"),
                        default: () =>
                          h("button", { type: "button" }, "Inner item"),
                      },
                    ),
                },
              ),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  getButton("Inner")?.click();
  await flushFrame();

  expect(innerOpen.value).toBe(true);
  expect(outerOpen.value).toBe(true);
  expect(popoverOpen.value).toBe(true);
});

test("it should close from its trigger when it also has an anchorEl", async () => {
  const anchor = document.createElement("div");

  document.body.appendChild(anchor);

  const wrapper = mountPopover({
    props: { modelValue: true, anchorEl: anchor },
  });

  await flushFrame();

  const trigger = getButton("Open");

  trigger?.dispatchEvent(new Event("pointerdown", { bubbles: true }));
  await flushPromises();
  trigger?.click();
  await flushPromises();

  expect(wrapper.props("modelValue")).toBe(false);
  expect(getDialog()).toBeNull();
});

test("it should close a menu anchored to a row when a menu inside the row opens", async () => {
  const contextOpen = ref(true);
  const actionsOpen = ref(false);
  const row = ref<null | HTMLElement>(null);

  const Host = defineComponent({
    setup() {
      return () => [
        h("div", { ref: row }, [
          h(
            Menu,
            {
              modelValue: actionsOpen.value,
              "onUpdate:modelValue": (value: boolean) => {
                actionsOpen.value = value;
              },
            },
            {
              trigger: () => h(Button, null, () => "Row actions"),
              default: () => h("button", { type: "button" }, "Edit"),
            },
          ),
        ]),
        h(
          Menu,
          {
            anchorEl: row.value,
            modelValue: contextOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              contextOpen.value = value;
            },
          },
          { default: () => h("button", { type: "button" }, "Copy") },
        ),
      ];
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  getButton("Row actions")?.click();
  await flushFrame();

  expect(actionsOpen.value).toBe(true);
  expect(contextOpen.value).toBe(false);
});

test("it should keep the outer menu open when an inner menu with an outside anchorEl opens", async () => {
  const outerOpen = ref(true);
  const innerOpen = ref(false);
  const toolbar = document.createElement("div");

  document.body.appendChild(toolbar);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Menu,
          {
            modelValue: outerOpen.value,
            "onUpdate:modelValue": (value: boolean) => {
              outerOpen.value = value;
            },
          },
          {
            trigger: () => h(Button, null, () => "Outer"),
            default: () =>
              h(
                Popover,
                { modelValue: true },
                {
                  trigger: () => h(Button, null, () => "Details"),
                  default: () =>
                    h(
                      Menu,
                      {
                        anchorEl: toolbar,
                        modelValue: innerOpen.value,
                        "onUpdate:modelValue": (value: boolean) => {
                          innerOpen.value = value;
                        },
                      },
                      {
                        trigger: () => h(Button, null, () => "Inner"),
                        default: () =>
                          h("button", { type: "button" }, "Inner item"),
                      },
                    ),
                },
              ),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);
  await flushFrame();

  getButton("Inner")?.click();
  await flushFrame();

  expect(innerOpen.value).toBe(true);
  expect(outerOpen.value).toBe(true);
});

test("it should stay open when the backdrop of a modal opened from it is pressed", async () => {
  const popover = ref(true);
  const modal = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h("div", [
          h(
            Popover,
            {
              modelValue: popover.value,
              "onUpdate:modelValue": (value: boolean) => {
                popover.value = value;
              },
            },
            {
              trigger: () => h(Button, null, () => "Open"),
              default: () => h("button", { type: "button" }, "Open modal"),
            },
          ),
          h(
            Modal,
            { transition: "none", modelValue: modal.value },
            { default: () => h("button", { type: "button" }, "Inside modal") },
          ),
        ]);
    },
  });

  mountedWrappers.push(mount(Host, { attachTo: document.body }));
  await flushFrame();

  const opener = Array.from(document.body.querySelectorAll("button")).find(
    (button) => button.textContent === "Open modal",
  );

  opener?.focus();
  modal.value = true;
  await flushFrame();

  const backdrop = document.body.querySelector('[data-modal-part="overlay"]');

  expect(backdrop).not.toBeNull();
  backdrop?.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
  await flushPromises();

  expect(popover.value).toBe(true);
});

test("it should close on Escape in the content under an unrelated layer", async () => {
  const wrapper = mountPopover({ props: { modelValue: true } });

  await flushFrame();

  const onEscape = vi.fn();
  const tooltip = pushLayerStack({
    onEscape,
    lockScroll: false,
    origin: () => null,
  });

  getDialog()?.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
  await flushPromises();

  expect(wrapper.props("modelValue")).toBe(false);
  expect(onEscape).not.toHaveBeenCalled();

  tooltip.release();
});

test("it should stay open when Escape closes a date picker inside it", async () => {
  const wrapper = mountPopover({
    props: { modelValue: true },
    slots: { default: () => h(DateField, { "aria-label": "Date" }) },
  });

  await flushFrame();

  const input = document.body.querySelector<HTMLInputElement>(
    '[role="dialog"] input',
  );

  input?.dispatchEvent(new FocusEvent("focus"));
  await flushPromises();
  input?.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    }),
  );
  await flushPromises();

  expect(wrapper.props("modelValue")).toBe(true);
});
