// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import {
  Sidebar,
  SidebarInset,
  SidebarList,
  SidebarListItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/Sidebar";

const AppShell = defineComponent({
  props: {
    side: {
      type: String,
      default: "left",
    },
    collapsible: {
      type: String,
      default: "offcanvas",
    },
  },
  setup(props) {
    return () =>
      h(SidebarProvider, null, {
        default: () => [
          h(
            Sidebar,
            {
              side: props.side as "left" | "right",
              collapsible: props.collapsible as "icon" | "none" | "offcanvas",
            },
            { default: () => h("nav", "Home") },
          ),
          h(SidebarInset, null, {
            default: () => [h(SidebarTrigger), h("p", "Main")],
          }),
        ],
      });
  },
});

test("it should render the sidebar aside and main inset", () => {
  const wrapper = mount(AppShell);

  expect(wrapper.find("aside").exists()).toBe(true);
  expect(wrapper.text()).toContain("Home");
  expect(wrapper.text()).toContain("Main");
});

test("it should default to expanded desktop state", () => {
  const wrapper = mount(AppShell);

  expect(wrapper.find("[data-state='expanded']").exists()).toBe(true);
});

test("it should toggle desktop open when the trigger is clicked", async () => {
  const wrapper = mount(AppShell);

  await wrapper.get("button[aria-label='Toggle sidebar']").trigger("click");

  expect(wrapper.find("[data-state='collapsed']").exists()).toBe(true);
});

test("it should keep expanded state when collapsible is none", async () => {
  const wrapper = mount(AppShell, { props: { collapsible: "none" } });

  await wrapper.get("button[aria-label='Toggle sidebar']").trigger("click");

  expect(wrapper.find("[data-state='expanded']").exists()).toBe(true);
  expect(wrapper.find("[data-state='collapsed']").exists()).toBe(false);
});

test("it should render header and footer slots", () => {
  const wrapper = mount(SidebarProvider, {
    slots: {
      default: () => [
        h(
          Sidebar,
          {},
          {
            default: () => "Nav",
            footer: () => h("div", "User"),
            header: () => h("div", "Brand"),
          },
        ),
        h(SidebarInset, null, {
          default: () => h(SidebarTrigger),
        }),
      ],
    },
  });

  expect(wrapper.text()).toContain("Brand");
  expect(wrapper.text()).toContain("User");
});

test("it should mark the trigger as expanded by default", async () => {
  const wrapper = mount(AppShell);

  await nextTick();

  expect(
    wrapper
      .get("button[aria-label='Toggle sidebar']")
      .attributes("aria-expanded"),
  ).toBe("true");
});

test("it should emit openChange when the trigger is clicked", async () => {
  const wrapper = mount(SidebarProvider, {
    props: { modelValue: true },
    slots: {
      default: () => [
        h(Sidebar, null, { default: () => h("nav", "Home") }),
        h(SidebarInset, null, {
          default: () => [h(SidebarTrigger), h("p", "Main")],
        }),
      ],
    },
  });

  await wrapper.get("button[aria-label='Toggle sidebar']").trigger("click");

  expect(wrapper.emitted("openChange")).toEqual([[false]]);
  expect(wrapper.emitted("update:modelValue")).toEqual([[false]]);
});

test("it should dock the left aside and slide it off-canvas by offsetting left", () => {
  const wrapper = mount(AppShell);
  const asideClass = wrapper.find("aside").classes().join(" ");

  expect(asideClass).toContain("left-0");
  expect(asideClass).toContain("overflow-hidden");
  expect(asideClass).toContain("left-[calc(var(--bridge-sidebar-width)*-1)]");
});

test("it should apply data-side from the side prop", () => {
  const wrapper = mount(AppShell, { props: { side: "right" } });

  expect(wrapper.find("[data-side='right']").exists()).toBe(true);
});

test("it should inert the aside when offcanvas is collapsed", async () => {
  const wrapper = mount(AppShell);

  await wrapper.get("button[aria-label='Toggle sidebar']").trigger("click");

  expect(wrapper.find("aside").attributes("inert")).toBeDefined();
});

test("it should not inert the aside when icon mode is collapsed", async () => {
  const wrapper = mount(AppShell, { props: { collapsible: "icon" } });

  await wrapper.get("button[aria-label='Toggle sidebar']").trigger("click");

  expect(wrapper.find("aside").attributes("inert")).toBeUndefined();
});

test("it should collapse SidebarList items when the icon rail is collapsed", async () => {
  const wrapper = mount(SidebarProvider, {
    props: { defaultOpen: false },
    slots: {
      default: () => [
        h(
          Sidebar,
          { collapsible: "icon" },
          {
            default: () =>
              h(SidebarList, null, {
                default: () =>
                  h(SidebarListItem, {
                    primary: "Home",
                    interactive: true,
                  }),
              }),
          },
        ),
        h(SidebarInset, null, {
          default: () => h(SidebarTrigger),
        }),
      ],
    },
  });

  await nextTick();

  expect(wrapper.get('[aria-label="Home"]').attributes("aria-label")).toBe(
    "Home",
  );
});

test("it should apply nav chrome on SidebarList and SidebarListItem", async () => {
  const wrapper = mount(SidebarProvider, {
    slots: {
      default: () => [
        h(Sidebar, null, {
          default: () =>
            h(SidebarList, null, {
              default: () =>
                h(SidebarListItem, {
                  primary: "Home",
                  interactive: true,
                }),
            }),
        }),
        h(SidebarInset, null, {
          default: () => h(SidebarTrigger),
        }),
      ],
    },
  });

  await nextTick();

  const home = wrapper.get('ul [role="button"]');

  expect(wrapper.find("ul").classes()).toContain("gap-1");
  expect(home.classes()).toContain("min-h-8");
  expect(home.classes()).toContain("rounded-lg");
});
