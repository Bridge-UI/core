// ** Local Imports
import { List } from "@/Components/List";

test("it should render the root element", () => {
  cy.mount(<List />);

  cy.get("ul").should("exist");
  cy.get("ul").should("have.class", "list-none");
});

test("it should apply padding classes when padding prop is set", () => {
  cy.mount(<List padding="none" />);

  cy.get("ul").should("have.class", "p-0");
});

test("it should apply nested indent when nested is true", () => {
  cy.mount(<List nested />);

  cy.get("ul").should("have.class", "pl-4");
});

test("it should render children", () => {
  cy.mount(
    <List>
      <li>Item one</li>
    </List>,
  );

  cy.contains("Item one").should("be.visible");
});

test("it should render a custom root element when as prop is set", () => {
  cy.mount(<List as="div" />);

  cy.get("div").should("exist");
  cy.get("ul").should("not.exist");
});
