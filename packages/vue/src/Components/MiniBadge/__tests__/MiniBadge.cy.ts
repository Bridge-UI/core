// ** Local Imports
import { MiniBadge } from "@/Components/MiniBadge";

test("it should render with default props", () => {
  cy.mount(MiniBadge, { slots: { default: () => "3" } });

  cy.get("span").should("exist").and("contain.text", "3");
});

test("it should apply sm size by default", () => {
  cy.mount(MiniBadge, { slots: { default: () => "1" } });

  cy.get("span").should("have.class", "min-w-6");
});

test("it should merge custom class", () => {
  cy.mount(MiniBadge, {
    slots: { default: () => "Styled" },
    props: { class: "custom-mini-badge" },
  });

  cy.get("span").should("have.class", "custom-mini-badge");
});
