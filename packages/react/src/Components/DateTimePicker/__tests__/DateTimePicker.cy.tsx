// ** Local Imports
import { DateTimePicker } from "@/Components/DateTimePicker";

test("it should render the date time picker", () => {
  cy.mount(<DateTimePicker defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  cy.contains("2021").should("be.visible");
  cy.get('button[aria-label="Hour 09"]').should("be.visible");
});

test("it should show footer when enabled", () => {
  cy.mount(<DateTimePicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
