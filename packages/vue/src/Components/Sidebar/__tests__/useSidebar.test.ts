// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import { Sidebar, SidebarProvider, useSidebar } from "@/Components/Sidebar";

test("it should throw when used outside SidebarProvider", () => {
  const Orphan = defineComponent({
    setup() {
      useSidebar();

      return () => h("div");
    },
  });

  expect(() => {
    mount(Orphan);
  }).toThrow("useSidebar must be used within a SidebarProvider");
});

test("it should default to open expanded state", () => {
  let sidebar!: ReturnType<typeof useSidebar>;

  const Probe = defineComponent({
    setup() {
      sidebar = useSidebar();

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    slots: {
      default: () => h(Sidebar, null, { default: () => h(Probe) }),
    },
  });

  expect(sidebar.value.open).toBe(true);
  expect(sidebar.value.state).toBe("expanded");
  expect(sidebar.value.openMobile).toBe(false);
});

test("it should toggle desktop open", async () => {
  let sidebar!: ReturnType<typeof useSidebar>;

  const Probe = defineComponent({
    setup() {
      sidebar = useSidebar();

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    slots: {
      default: () => h(Sidebar, null, { default: () => h(Probe) }),
    },
  });

  sidebar.value.toggleSidebar();
  await nextTick();

  expect(sidebar.value.open).toBe(false);
  expect(sidebar.value.state).toBe("collapsed");
});

test("it should expose side and collapsible from Sidebar", async () => {
  let sidebar!: ReturnType<typeof useSidebar>;

  const Probe = defineComponent({
    setup() {
      sidebar = useSidebar();

      return () => h("div");
    },
  });

  mount(SidebarProvider, {
    slots: {
      default: () =>
        h(
          Sidebar,
          { side: "right", collapsible: "icon" },
          { default: () => h(Probe) },
        ),
    },
  });

  await nextTick();

  expect(sidebar.value.side).toBe("right");
  expect(sidebar.value.collapsible).toBe("icon");
});
