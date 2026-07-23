// ** External Imports
import { h } from "vue";

// ** Local Imports
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";

test("it should render primary text from the primary prop", () => {
  cy.mount(ListItem, { props: { primary: "Edit item" } });

  cy.contains("Edit item").should("be.visible");
});

test("it should render an interactive wrapper with menuitem role", () => {
  cy.mount(ListItem, {
    props: {
      role: "menuitem",
      interactive: true,
      primary: "Action",
    },
  });

  cy.get('[role="menuitem"]').should("exist");
  cy.get('[role="menuitem"]').should("have.attr", "tabindex", "0");
});

test("it should inherit dense padding from parent List", () => {
  cy.mount(List, {
    props: { dense: true },
    slots: {
      default: () =>
        h(ListItem, {
          role: "menuitem",
          interactive: true,
          primary: "Dense item",
        }),
    },
  });

  cy.get('[role="menuitem"]').should("have.class", "py-1.5");
});

test("it should apply selected styles when selected is true", () => {
  cy.mount(ListItem, {
    props: {
      selected: true,
      interactive: true,
      primary: "Selected",
    },
  });

  cy.get('[role="button"]').should("have.class", "bg-primary-50");
});

test("it should render a check icon when selected is true", () => {
  cy.mount(ListItem, {
    props: {
      selected: true,
      interactive: true,
      primary: "Selected",
    },
  });

  cy.get("svg").should("exist");
});

test("it should not render a selected icon when selectedIcon is null", () => {
  cy.mount(ListItem, {
    props: {
      selected: true,
      interactive: true,
      selectedIcon: null,
      primary: "Selected",
    },
  });

  cy.get("svg").should("not.exist");
});

test("it should disable interaction when disabled is true", () => {
  cy.mount(ListItem, {
    props: {
      disabled: true,
      interactive: true,
      primary: "Disabled",
    },
  });

  cy.get('[role="button"]').should("have.attr", "tabindex", "-1");
  cy.get('[role="button"]').should("have.attr", "aria-disabled", "true");
});
