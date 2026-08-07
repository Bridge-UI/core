// ** Local Imports
import { DateRangeField } from "@/Components/DateRangeField";

test("it should render the date range field", () => {
  cy.mount(DateRangeField);

  cy.get("input").should("be.visible");
});

test("it should open dual calendars on focus", () => {
  cy.mount(DateRangeField, {
    props: {
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  cy.get("input").focus();
  cy.get('[aria-label="Select year"]').should("be.visible");
});
