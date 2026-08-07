// ** Local Imports
import { DatePicker } from "@/Components/DatePicker";

test("it should render the date picker", () => {
  cy.mount(<DatePicker defaultValue={new Date(2021, 4, 21)} />);

  cy.contains("2021").should("be.visible");
});

test("it should show footer when enabled", () => {
  cy.mount(<DatePicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
