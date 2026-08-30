// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, nextTick } from "vue";

// ** Local Imports
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/Sidebar";

const AppShell = defineComponent({
  props: {
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
            { collapsible: props.collapsible as "offcanvas" },
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
            footer: () => h("div", "User"),
            header: () => h("div", "Brand"),
            default: () => "Nav",
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
