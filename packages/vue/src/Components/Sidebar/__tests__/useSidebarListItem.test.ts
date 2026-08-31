// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import {
  Sidebar,
  SidebarProvider,
  useSidebarListItem,
} from "@/Components/Sidebar";

function mountUseSidebarListItem(
  itemProps: { primary?: string; secondary?: string } = {},
  sidebarProps: {
    collapsible?: "icon" | "none" | "offcanvas";
    side?: "left" | "right";
  } = {},
  providerProps: { defaultOpen?: boolean } = {},
) {
  let result!: ReturnType<typeof useSidebarListItem>;

  const Probe = defineComponent({
    setup() {
      result = useSidebarListItem(itemProps);

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    props: providerProps,
    slots: {
      default: () => h(Sidebar, sidebarProps, { default: () => h(Probe) }),
    },
  });

  return result;
}

test("it should use primary as tooltip when the icon rail is collapsed", async () => {
  const { tooltip, tooltipPlacement } = mountUseSidebarListItem(
    { primary: "Home" },
    { collapsible: "icon" },
    { defaultOpen: false },
  );

  await nextTick();

  expect(tooltip.value).toBe("Home");
  expect(tooltipPlacement.value).toBe("right");
});

test("it should place the tooltip opposite a right rail", async () => {
  const { tooltipPlacement } = mountUseSidebarListItem(
    { primary: "Home" },
    { side: "right", collapsible: "icon" },
    { defaultOpen: false },
  );

  await nextTick();

  expect(tooltipPlacement.value).toBe("left");
});

test("it should omit the tooltip when the rail is expanded", async () => {
  const { tooltip } = mountUseSidebarListItem(
    { primary: "Home" },
    { collapsible: "icon" },
  );

  await nextTick();

  expect(tooltip.value).toBeUndefined();
});

test("it should apply compact nav chrome when the rail is expanded", async () => {
  const { itemClasses } = mountUseSidebarListItem(
    { primary: "Home" },
    { collapsible: "icon" },
  );

  await nextTick();

  expect(itemClasses.value.interactive).toContain("min-h-8");
  expect(itemClasses.value.interactive).toContain("rounded-lg");
});

test("it should apply a taller hit when secondary is set", async () => {
  const { itemClasses } = mountUseSidebarListItem(
    { primary: "Acme Inc", secondary: "Enterprise" },
    { collapsible: "icon" },
  );

  await nextTick();

  expect(itemClasses.value.interactive).toContain("py-2");
  expect(itemClasses.value.interactive).toContain("min-h-12");
});
