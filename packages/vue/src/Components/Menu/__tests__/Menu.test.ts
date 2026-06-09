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
