// ** Local Imports
import { Pagination } from "@/Components/Pagination";

test("it should render pagination in the browser", () => {
  cy.mount(<Pagination page={2} count={5} aria-label="Pagination" />);

  cy.get("nav[aria-label='Pagination']").should("exist");
  cy.contains("button", "2").should("be.visible");
  cy.get("button[aria-current='page']").should("contain", "2");
});

test("it should render outlined and ghost variants", () => {
  cy.mount(<Pagination page={1} count={4} variant="outlined" />);
  cy.get("ul").should("have.class", "rounded-md");

  cy.mount(<Pagination page={1} count={4} variant="ghost" />);
  cy.get("ul").should("have.class", "gap-1");
});
