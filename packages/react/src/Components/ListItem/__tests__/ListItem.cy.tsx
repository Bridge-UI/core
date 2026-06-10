// ** Local Imports
import { List } from "@/Components/List";
import { ListItem } from "@/Components/ListItem";

test("it should render primary text from the primary prop", () => {
  cy.mount(<ListItem primary="Edit item" />);

  cy.contains("Edit item").should("be.visible");
});

test("it should render an interactive wrapper with menuitem role", () => {
  cy.mount(<ListItem interactive primary="Action" role="menuitem" />);

  cy.get('[role="menuitem"]').should("exist");
  cy.get('[role="menuitem"]').should("have.attr", "tabindex", "0");
});

test("it should inherit dense padding from parent List", () => {
  cy.mount(
    <List dense>
      <ListItem interactive primary="Dense item" role="menuitem" />
    </List>,
  );

  cy.get('[role="menuitem"]').should("have.class", "py-1.5");
});

test("it should apply selected styles when selected is true", () => {
  cy.mount(<ListItem selected interactive primary="Selected" />);

  cy.get('[role="button"]').should("have.class", "bg-primary-50");
});

test("it should disable interaction when disabled is true", () => {
  cy.mount(<ListItem disabled interactive primary="Disabled" />);

  cy.get('[role="button"]').should("have.attr", "tabindex", "-1");
  cy.get('[role="button"]').should("have.attr", "aria-disabled", "true");
});
