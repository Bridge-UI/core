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

test("it should apply stacked nav chrome on the list root", async () => {
  const { rootClassName } = mountUseSidebarList({}, { collapsible: "icon" });

  await nextTick();

  expect(rootClassName.value).toContain("p-0");
  expect(rootClassName.value).toContain("px-2");
  expect(rootClassName.value).toContain("gap-1");
});

test("it should apply a nested start-edge guide line", async () => {
  let result!: ReturnType<typeof useSidebarList>;

  const Probe = defineComponent({
    setup() {
      result = useSidebarList({ nested: true });

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    slots: {
      default: () =>
        h(Sidebar, { collapsible: "icon" }, { default: () => h(Probe) }),
    },
  });

  await nextTick();

  expect(result.rootClassName.value).toContain("ml-3.5");
  expect(result.rootClassName.value).toContain("border-l");
  expect(result.rootClassName.value).not.toContain("w-full");
});

test("it should hide nested lists when the icon rail is collapsed", async () => {
  let result!: ReturnType<typeof useSidebarList>;

  const Probe = defineComponent({
    setup() {
      result = useSidebarList({ nested: true });

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    props: { defaultOpen: false },
    slots: {
      default: () =>
        h(Sidebar, { collapsible: "icon" }, { default: () => h(Probe) }),
    },
  });

  await nextTick();

  expect(result.rootClassName.value).toContain("hidden");
});
