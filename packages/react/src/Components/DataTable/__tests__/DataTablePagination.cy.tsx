// ** Local Imports
import DataTablePagination from "@/Components/DataTable/DataTablePagination";

test("it should render first and last controls in the browser", () => {
  cy.mount(<DataTablePagination page={1} count={7} />);

  cy.get("nav[aria-label='Pagination']").should("exist");
  cy.get("button[aria-label='First page']").should("be.disabled");
  cy.get("button[aria-label='Last page']").should("be.visible");
  cy.get("button[aria-label^='Page ']").should("not.exist");
});
