// ** Local Imports
import { DatePicker } from "@/Components/DatePicker";

test("it should render the calendar header", () => {
  cy.mount(DatePicker, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get('[aria-label="Select year"]').should("be.visible");
});

test("it should show footer when showFooter is set", () => {
  cy.mount(DatePicker, { props: { showFooter: true } });

  cy.contains("button", "Cancel").should("be.visible");
  cy.contains("button", "Apply").should("be.visible");
});
