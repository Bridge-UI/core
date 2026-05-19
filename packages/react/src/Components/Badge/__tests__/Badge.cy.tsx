// ** Local Imports
import { Badge } from "@/Components/Badge";

test("it should render with default props", () => {
  cy.mount(<Badge>New</Badge>);

  cy.get("span").should("exist").and("contain.text", "New");
});

test("it should apply rounded-full by default", () => {
  cy.mount(<Badge>Label</Badge>);

  cy.get("span").should("have.class", "rounded-full");
});

test("it should render error color", () => {
  cy.mount(<Badge color="error">Error</Badge>);

  cy.contains("Error").should("be.visible");
});

test("it should merge custom className", () => {
  cy.mount(<Badge className="custom-badge">Styled</Badge>);

  cy.get("span").should("have.class", "custom-badge");
});
