// ** Local Imports
import { Skeleton } from "@/Components/Skeleton";

test("it should render with default props", () => {
  cy.mount(Skeleton, { props: { class: "h-4 w-32" } });

  cy.get("div").should("exist").and("have.class", "rounded-md");
});

test("it should apply rounded-full", () => {
  cy.mount(Skeleton, {
    props: { rounded: "full", class: "h-10 w-10" },
  });

  cy.get("div").should("have.class", "rounded-full");
});

test("it should merge custom class", () => {
  cy.mount(Skeleton, { props: { class: "h-4 w-48" } });

  cy.get("div").should("have.class", "h-4").and("have.class", "w-48");
});

test("it should apply pulse animation", () => {
  cy.mount(Skeleton, { props: { class: "h-4 w-32" } });

  cy.get("div").should("have.class", "animate-pulse");
});
