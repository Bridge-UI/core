// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";

test("it should render menu content when modelValue is true", () => {
  cy.mount(FieldOverlay, {
    slots: { default: () => "Menu body" },
    props: { overlay: "menu", modelValue: true },
  });

  cy.contains("Menu body").should("be.visible");
  cy.get('[role="menu"]').should("exist");
});

test("it should render drawer dialog when overlay is drawer", () => {
  cy.mount(FieldOverlay, {
    slots: { default: () => "Drawer body" },
    props: {
      modelValue: true,
      overlay: "drawer",
      customProps: { drawer: { transition: "none" } },
    },
  });

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Drawer body").should("be.visible");
});

test("it should render modal dialog when overlay is modal", () => {
  cy.mount(FieldOverlay, {
    slots: { default: () => "Modal body" },
    props: {
      modelValue: true,
      overlay: "modal",
      customProps: { modal: { transition: "none" } },
    },
  });

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Modal body").should("be.visible");
});

test("it should not render when modelValue is false", () => {
  cy.mount(FieldOverlay, {
    slots: { default: () => "Hidden" },
    props: { overlay: "menu", modelValue: false },
  });

  cy.contains("Hidden").should("not.exist");
});
