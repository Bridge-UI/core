// ** Local Imports
import { TimeField } from "@/Components/TimeField";

test("it should render the time input", () => {
  cy.mount(TimeField, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(TimeField, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  cy.get("input").click();
  cy.get("button").should("have.length.greaterThan", 24);
});
