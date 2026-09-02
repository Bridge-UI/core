// ** Local Imports
import { Pagination } from "@/Components/Pagination";

test("it should render pagination in the browser", () => {
  cy.mount(Pagination, {
    props: { count: 5, modelValue: 2 },
    attrs: { "aria-label": "Pagination" },
  });

  cy.get("nav[aria-label='Pagination']").should("exist");
  cy.contains("button", "2").should("be.visible");
  cy.get("button[aria-current='page']").should("contain", "2");
});

test("it should render outlined and ghost variants", () => {
  cy.mount(Pagination, {
    props: { count: 4, modelValue: 1, variant: "outlined" },
  });
  cy.get("ul").should("have.class", "rounded-md");

  cy.mount(Pagination, {
    props: { count: 4, modelValue: 1, variant: "ghost" },
  });
  cy.get("ul").should("have.class", "gap-2");
});
