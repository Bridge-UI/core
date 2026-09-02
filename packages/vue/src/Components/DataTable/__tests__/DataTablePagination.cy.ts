// ** Local Imports
import { DataTablePagination } from "@/Components/DataTable";

test("it should render first and last controls in the browser", () => {
  cy.mount(DataTablePagination, {
    props: { count: 7, modelValue: 1 },
  });

  cy.get("nav[aria-label='Pagination']").should("exist");
  cy.get("button[aria-label='First page']").should("be.disabled");
  cy.get("button[aria-label='Last page']").should("be.visible");
  cy.get("button[aria-label^='Page ']").should("not.exist");
});
