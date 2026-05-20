// ** Local Imports
import { MiniBadge } from "@/Components/MiniBadge";

test("it should render with default props", () => {
  cy.mount(<MiniBadge>3</MiniBadge>);

  cy.get("span").should("exist").and("contain.text", "3");
});

test("it should apply sm size by default", () => {
  cy.mount(<MiniBadge>1</MiniBadge>);

  cy.get("span").should("have.class", "min-w-6");
});

test("it should merge custom className", () => {
  cy.mount(<MiniBadge className="custom-mini-badge">Styled</MiniBadge>);

  cy.get("span").should("have.class", "custom-mini-badge");
});
