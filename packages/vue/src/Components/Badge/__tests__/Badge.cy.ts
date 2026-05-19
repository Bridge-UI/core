// ** Local Imports
import { Badge } from "@/Components/Badge";

test("it should render with default props", () => {
  cy.mount(Badge, { slots: { default: () => "New" } });

  cy.get("span").should("exist").and("contain.text", "New");
});

test("it should apply rounded-full by default", () => {
  cy.mount(Badge, { slots: { default: () => "Label" } });

  cy.get("span").should("have.class", "rounded-full");
});

test("it should render error color", () => {
  cy.mount(Badge, {
    props: { color: "error" },
    slots: { default: () => "Error" },
  });

  cy.contains("Error").should("be.visible");
});

test("it should merge custom class", () => {
  cy.mount(Badge, {
    props: { class: "custom-badge" },
    slots: { default: () => "Styled" },
  });

  cy.get("span").should("have.class", "custom-badge");
});
