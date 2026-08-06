// ** Local Imports
import { DateTimeField } from "@/Components/DateTimeField";

test("it should render the date time input", () => {
  cy.mount(<DateTimeField defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(<DateTimeField defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  cy.get("input").click();
  cy.contains("2021").should("be.visible");
  cy.get('button[aria-label="Hour 09"]').should("be.visible");
});
