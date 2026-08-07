// ** Local Imports
import { Calendar } from "@/Components/Calendar";

test("it should render the calendar header", () => {
  cy.mount(<Calendar viewDate={new Date(2021, 4, 1)} />);

  cy.contains("2021").should("be.visible");
  cy.contains(/may/i).should("be.visible");
});

test("it should navigate to the month panel", () => {
  cy.mount(<Calendar viewDate={new Date(2021, 4, 1)} />);

  cy.get('[aria-label="Select month"]').click();
  cy.contains("button", /january/i).should("be.visible");
});
