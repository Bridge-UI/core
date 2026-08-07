// ** Local Imports
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";

test("it should render the date time range picker", () => {
  cy.mount(DateTimeRangePicker, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
    },
  });

  cy.get('[aria-label="Select year"]').should("be.visible");
  cy.get("button").should("have.length.greaterThan", 48);
});

test("it should show footer when showFooter is set", () => {
  cy.mount(DateTimeRangePicker, { props: { showFooter: true } });

  cy.contains("button", "Cancel").should("be.visible");
  cy.contains("button", "Apply").should("be.visible");
});
