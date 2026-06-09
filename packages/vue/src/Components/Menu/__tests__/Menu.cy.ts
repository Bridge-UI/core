// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Button } from "@/Components/Button";
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";
import { Menu } from "@/Components/Menu";

test("it should not render menu when modelValue is false", () => {
  cy.mount(Menu, {
    props: { modelValue: false },
    slots: { trigger: () => h(Button, null, () => "Open") },
  });

  cy.get('[role="menu"]').should("not.exist");
});

test("it should render menu when modelValue is true", () => {
  cy.mount(Menu, {
    props: { modelValue: true },
    slots: {
      default: () => "Menu body",
      trigger: () => h(Button, null, () => "Open"),
    },
  });

  cy.get('[role="menu"]').should("be.visible");
  cy.contains("Menu body").should("be.visible");
});

test("it should open when the trigger is clicked", () => {
  cy.mount(Menu, {
    props: { modelValue: false },
    slots: {
      default: () => "Menu body",
      trigger: () => h(Button, null, () => "Open"),
    },
  });

  cy.get('[aria-haspopup="menu"]').click();
  cy.get('[role="menu"]').should("be.visible");
});

test("it should close when the trigger is clicked again", () => {
  cy.mount(Menu, {
    props: { modelValue: false },
    slots: {
      default: () => "Menu body",
      trigger: () => h(Button, null, () => "Open"),
    },
  });

  cy.get('[aria-haspopup="menu"]').click();
  cy.get('[role="menu"]').should("be.visible");

  cy.get('[aria-haspopup="menu"]').click();
  cy.get('[role="menu"]').should("not.exist");
});

test("it should emit update:modelValue when the trigger toggles open", () => {
  cy.mount(Menu, {
    props: {
      modelValue: false,
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
    slots: {
      default: () => "Menu body",
      trigger: () => h(Button, null, () => "Open"),
    },
  });

  cy.get('[aria-haspopup="menu"]').click();

  cy.get("@onUpdate").should("have.been.calledWith", true);
});

test("it should render List and ListItem inside the menu panel", () => {
  cy.mount(Menu, {
    props: { modelValue: true },
    slots: {
      trigger: () => h(Button, null, () => "Open"),
      default: () =>
        h(List, { dense: true, padding: "none" }, () => [
          h(ListItem, {
            role: "menuitem",
            interactive: true,
            primary: "Item one",
          }),
        ]),
    },
  });

  cy.get('[role="menu"]').should("be.visible");
  cy.get('[role="menuitem"]').should("be.visible");
  cy.contains("Item one").should("be.visible");
});
