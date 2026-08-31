// ** External Imports
import { h } from "vue";

// ** Local Imports
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/Components/Sidebar";

test("it should render the sidebar and inset", () => {
  cy.mount(SidebarProvider, {
    slots: {
      default: () => [
        h(Sidebar, null, { default: () => "Home" }),
        h(SidebarInset, null, {
          default: () => [h(SidebarTrigger), "Main"],
        }),
      ],
    },
  });

  cy.contains("Home").should("exist");
  cy.contains("Main").should("be.visible");
  cy.get("button[aria-label='Toggle sidebar']").should("be.visible");
});

test("it should collapse when the trigger is clicked", () => {
  cy.mount(SidebarProvider, {
    slots: {
      default: () => [
        h(Sidebar, null, { default: () => "Home" }),
        h(SidebarInset, null, {
          default: () => [h(SidebarTrigger), "Main"],
        }),
      ],
    },
  });

  cy.get("[data-state='expanded']").should("exist");
  cy.get("button[aria-label='Toggle sidebar']").click();
  cy.get("[data-state='collapsed']").should("exist");
});

test("it should render header slot content", () => {
  cy.mount(SidebarProvider, {
    slots: {
      default: () => [
        h(
          Sidebar,
          {},
          {
            default: () => "Nav",
            header: () => h("div", "Brand"),
          },
        ),
        h(SidebarInset, null, { default: () => h(SidebarTrigger) }),
      ],
    },
  });

  cy.contains("Brand").should("exist");
});

test("it should inert the aside when offcanvas is collapsed", () => {
  cy.mount(SidebarProvider, {
    slots: {
      default: () => [
        h(Sidebar, null, { default: () => "Home" }),
        h(SidebarInset, null, {
          default: () => [h(SidebarTrigger), "Main"],
        }),
      ],
    },
  });

  cy.get("button[aria-label='Toggle sidebar']").click();
  cy.get("aside").should("have.attr", "inert");
});
