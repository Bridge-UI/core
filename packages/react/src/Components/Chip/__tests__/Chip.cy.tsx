// ** Local Imports
import { Chip } from "@/Components/Chip";

test("it should render with default props", () => {
  cy.mount(<Chip label="New" />);

  cy.get("span").should("exist").and("contain.text", "New");
});

test("it should apply size classes", () => {
  cy.mount(<Chip size="xs" label="Small" />);

  cy.contains("Small").should("have.class", "text-xs");
});

test("it should render dismissible clear control", () => {
  cy.mount(<Chip dismissible label="Removable" />);

  cy.get('[role="button"]').should("have.attr", "aria-label", "Remove");
});
