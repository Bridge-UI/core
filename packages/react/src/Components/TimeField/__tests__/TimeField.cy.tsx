// ** Local Imports
import { TimeField } from "@/Components/TimeField";

test("it should render the time input", () => {
  cy.mount(<TimeField defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(<TimeField defaultValue={new Date(2021, 4, 21, 9, 30)} />);

  cy.get("input").click();
  cy.get('button[aria-label="Hour 09"]').should("be.visible");
});
