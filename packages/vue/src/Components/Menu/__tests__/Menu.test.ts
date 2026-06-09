// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";
import { Menu } from "@/Components/Menu";
import { resetLayerStackForTests } from "@bridge-ui/core";

afterEach(async () => {
  while (mountedWrappers.length > 0) {
    mountedWrappers.pop()?.unmount();
  }

  await flushPromises();
  resetLayerStackForTests();
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function mountMenu(options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(Menu, {
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

test("it should open the menu when the trigger is clicked", async () => {
  const wrapper = mountMenu({
    props: { modelValue: false },
    slots: {
      trigger: () => h(Button, null, () => "Open"),
      default: () =>
        h(List, { dense: true, role: "menu", padding: "none" }, () => [
          h(ListItem, {
            role: "menuitem",
            interactive: true,
            primary: "Item one",
          }),
        ]),
    },
  });

  expect(document.body.querySelector('[role="menu"]')).toBeNull();

  const button = wrapper.find("button");

  await button.trigger("click");
  await flushPromises();

  expect(document.body.querySelector('[role="menu"]')).not.toBeNull();
  expect(document.body.textContent).toContain("Item one");
});

test("it should open when the trigger child also sets modelValue on click", async () => {
  const open = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Menu,
          {
            modelValue: open.value,
            "onUpdate:modelValue": (value: boolean) => {
              open.value = value;
            },
          },
          {
            default: () => "Menu body",
            trigger: () =>
              h(
                Button,
                {
                  onClick: () => {
                    open.value = true;
                  },
                },
                () => "Open",
              ),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  await wrapper.find("button").trigger("click");
  await flushPromises();

  expect(open.value).toBe(true);
  expect(document.body.textContent).toContain("Menu body");
});

test("it should toggle open state via v-model", async () => {
  const open = ref(false);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          Menu,
          {
            modelValue: open.value,
            "onUpdate:modelValue": (value: boolean) => {
              open.value = value;
            },
          },
          {
            default: () => "Menu body",
            trigger: () => h(Button, null, () => "Open"),
          },
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  expect(open.value).toBe(false);

  await wrapper.find("button").trigger("click");
  await flushPromises();

  expect(open.value).toBe(true);
  expect(document.body.textContent).toContain("Menu body");
});

test("it should not lock body scroll by default", async () => {
  mountMenu({
    props: { modelValue: true },
    slots: {
      default: () => "Menu body",
      trigger: () => h(Button, null, () => "Open"),
    },
  });

  expect(document.body.style.overflow).not.toBe("hidden");
});

test("it should switch to another menu in one click while one is open", async () => {
  const open = ref<"a" | "b" | null>(null);

  const Host = defineComponent({
    setup() {
      return () =>
        h("div", [
          h(
            Menu,
            {
              modelValue: open.value === "a",
              "onUpdate:modelValue": (value: boolean) => {
                if (!value) {
                  open.value = null;
                }
              },
            },
            {
              default: () => "Menu A",
              trigger: () =>
                h(
                  Button,
                  {
                    onClick: () => {
                      open.value = "a";
                    },
                  },
                  () => "A",
                ),
            },
          ),
          h(
            Menu,
            {
              modelValue: open.value === "b",
              "onUpdate:modelValue": (value: boolean) => {
                if (!value) {
                  open.value = null;
                }
              },
            },
            {
              default: () => "Menu B",
              trigger: () =>
                h(
                  Button,
                  {
                    onClick: () => {
                      open.value = "b";
                    },
                  },
                  () => "B",
                ),
            },
          ),
        ]);
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  const buttons = wrapper.findAll("button");

  await buttons[0].trigger("click");
  await flushPromises();

  expect(open.value).toBe("a");
  expect(document.body.textContent).toContain("Menu A");

  await buttons[1].trigger("click");
  await flushPromises();

  expect(open.value).toBe("b");
  expect(document.body.textContent).toContain("Menu B");
  expect(document.body.textContent).not.toContain("Menu A");
});

test("it should keep the open menu on pointerdown over another trigger until click", async () => {
  const open = ref<"a" | "b" | null>(null);

  const Host = defineComponent({
    setup() {
      return () =>
        h("div", [
          h(
            Menu,
            {
              modelValue: open.value === "a",
              "onUpdate:modelValue": (value: boolean) => {
                if (!value) {
                  open.value = null;
                }
              },
            },
            {
              default: () => "Menu A",
              trigger: () =>
                h(
                  Button,
                  {
                    onClick: () => {
                      open.value = "a";
                    },
                  },
                  () => "A",
                ),
            },
          ),
          h(
            Menu,
            {
              modelValue: open.value === "b",
              "onUpdate:modelValue": (value: boolean) => {
                if (!value) {
                  open.value = null;
                }
              },
            },
            {
              default: () => "Menu B",
              trigger: () =>
                h(
                  Button,
                  {
                    onClick: () => {
                      open.value = "b";
                    },
                  },
                  () => "B",
                ),
            },
          ),
        ]);
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  const buttons = wrapper.findAll("button");

  await buttons[0].trigger("click");
  await flushPromises();

  expect(open.value).toBe("a");

  await buttons[1].trigger("pointerdown");
  await flushPromises();

  expect(open.value).toBe("a");
  expect(document.body.textContent).toContain("Menu A");
});

test("it should close other menus with anchorEl when another opens", async () => {
  const openA = ref(false);
  const openB = ref(false);
  const anchorA = ref<HTMLElement | null>(null);
  const anchorB = ref<HTMLElement | null>(null);

  const Host = defineComponent({
    setup() {
      return () =>
        h("div", [
          h(
            "button",
            {
              ref: anchorA,
              type: "button",
              onClick: () => {
                openA.value = true;
              },
            },
            "Open A",
          ),
          h(
            Menu,
            {
              anchorEl: anchorA.value,
              modelValue: openA.value,
              "onUpdate:modelValue": (value: boolean) => {
                openA.value = value;
              },
            },
            { default: () => "Menu A" },
          ),
          h(
            "button",
            {
              ref: anchorB,
              type: "button",
              onClick: () => {
                openB.value = true;
              },
            },
            "Open B",
          ),
          h(
            Menu,
            {
              anchorEl: anchorB.value,
              modelValue: openB.value,
              "onUpdate:modelValue": (value: boolean) => {
                openB.value = value;
              },
            },
            { default: () => "Menu B" },
          ),
        ]);
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  const buttons = wrapper.findAll("button");

  await buttons[0].trigger("click");
  await flushPromises();

  expect(openA.value).toBe(true);
  expect(document.body.textContent).toContain("Menu A");

  await buttons[1].trigger("click");
  await flushPromises();

  expect(openA.value).toBe(false);
  expect(openB.value).toBe(true);
  expect(document.body.textContent).toContain("Menu B");
  expect(document.body.textContent).not.toContain("Menu A");
});

test("it should switch placement menus in one click in either direction", async () => {
  const placements = ["top-start", "bottom-end"] as const;
  const open = ref<(typeof placements)[number] | null>(null);

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          "div",
          placements.map((placement) =>
            h(
              Menu,
              {
                placement,
                key: placement,
                modelValue: open.value === placement,
                "onUpdate:modelValue": (value: boolean) => {
                  if (!value && open.value === placement) {
                    open.value = null;
                  }
                },
              },
              {
                default: () => `Menu ${placement}`,
                trigger: () =>
                  h(
                    Button,
                    {
                      onClick: () => {
                        open.value = placement;
                      },
                    },
                    () => placement,
                  ),
              },
            ),
          ),
        );
    },
  });

  const wrapper = mount(Host, { attachTo: document.body });

  mountedWrappers.push(wrapper);

  const buttons = wrapper.findAll("button");

  await buttons[0].trigger("click");
  await flushPromises();

  expect(open.value).toBe("top-start");
  expect(document.body.textContent).toContain("Menu top-start");

  await buttons[1].trigger("click");
  await flushPromises();

  expect(open.value).toBe("bottom-end");
  expect(document.body.textContent).toContain("Menu bottom-end");
  expect(document.body.textContent).not.toContain("Menu top-start");

  await buttons[0].trigger("click");
  await flushPromises();

  expect(open.value).toBe("top-start");
  expect(document.body.textContent).toContain("Menu top-start");
  expect(document.body.textContent).not.toContain("Menu bottom-end");
});

test("it should lock body scroll when disableScrollLock is false", async () => {
  mountMenu({
    props: { modelValue: true, disableScrollLock: false },
    slots: {
      default: () => "Menu body",
      trigger: () => h(Button, null, () => "Open"),
    },
  });

  expect(document.body.style.overflow).toBe("hidden");
});
