// ** Local Imports
import { Text } from "@/Components/Text";

test("it should render with default props", () => {
  cy.mount(Text, { slots: { default: () => "Hello" } });

  cy.get("p")
    .should("contain.text", "Hello")
    .and("have.class", "text-base")
    .and("have.class", "text-dark-950");
});

test("it should render muted text", () => {
  cy.mount(Text, { props: { variant: "muted" } });

  cy.get("p").should("have.class", "text-dark-500");
});

test("it should render as a span", () => {
  cy.mount(Text, { props: { as: "span", size: "xs" } });

  cy.get("span").should("have.class", "text-xs");
});

test("it should apply color and weight", () => {
  cy.mount(Text, { props: { color: "error", weight: "bold" } });

  cy.get("p")
    .should("have.class", "text-error-600")
    .and("have.class", "font-bold");
});
