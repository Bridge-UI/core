// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import { Sidebar, SidebarProvider, useSidebarList } from "@/Components/Sidebar";

function mountUseSidebarList(
  props: { iconOnly?: boolean } = {},
  sidebarProps: { collapsible?: "icon" | "none" | "offcanvas" } = {},
  providerProps: { defaultOpen?: boolean } = {},
) {
  let result!: ReturnType<typeof useSidebarList>;

  const Probe = defineComponent({
    props: {
      iconOnly: {
        type: Boolean,
        default: undefined,
      },
    },
    setup(probeProps) {
      result = useSidebarList(probeProps);

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    props: providerProps,
    slots: {
      default: () =>
        h(Sidebar, sidebarProps, {
          default: () => h(Probe, props),
        }),
    },
  });

  return result;
}

test("it should set iconOnly when the icon rail is collapsed", async () => {
  const { iconOnly } = mountUseSidebarList(
    {},
    { collapsible: "icon" },
    { defaultOpen: false },
  );

  await nextTick();

  expect(iconOnly.value).toBe(true);
});

test("it should not set iconOnly when the icon rail is expanded", async () => {
  const { iconOnly } = mountUseSidebarList({}, { collapsible: "icon" });

  await nextTick();

  expect(iconOnly.value).toBe(false);
});

test("it should allow iconOnly to be overridden", async () => {
  const { iconOnly } = mountUseSidebarList(
    { iconOnly: false },
    { collapsible: "icon" },
    { defaultOpen: false },
  );

  await nextTick();

  expect(iconOnly.value).toBe(false);
});
