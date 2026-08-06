// ** Local Imports
import { TimePicker } from "@/Components/TimePicker";

test("it should render the time picker", () => {
  cy.mount(<TimePicker defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  cy.get('button[aria-label="Hour 09"]').should("be.visible");
});

test("it should show footer when enabled", () => {
  cy.mount(<TimePicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
