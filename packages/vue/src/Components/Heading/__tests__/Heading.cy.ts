// ** Local Imports
import { Heading } from "@/Components/Heading";

test("it should render with default props", () => {
  cy.mount(Heading, { slots: { default: () => "Title" } });

  cy.get("h2")
    .should("contain.text", "Title")
    .and("have.class", "text-2xl")
    .and("have.class", "font-semibold");
});

test("it should render the given level", () => {
  cy.mount(Heading, { props: { level: 1 } });

  cy.get("h1").should("have.class", "text-3xl");
});

test("it should apply size over level", () => {
  cy.mount(Heading, { props: { level: 1, size: "md" } });

  cy.get("h1").should("have.class", "text-base");
});
