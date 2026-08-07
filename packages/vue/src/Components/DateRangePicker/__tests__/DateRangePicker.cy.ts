// ** Local Imports
import { DateRangePicker } from "@/Components/DateRangePicker";

test("it should render the date range picker", () => {
  cy.mount(DateRangePicker, {
    props: {
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  cy.contains("May").should("be.visible");
});

test("it should show footer when enabled", () => {
  cy.mount(DateRangePicker, {
    props: { showFooter: true },
  });

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
