// ** Local Imports
import { DateTimeField } from "@/Components/DateTimeField";

test("it should render the date-time input", () => {
  cy.mount(DateTimeField, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(DateTimeField, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  cy.get("input").click();
  cy.contains("2021").should("be.visible");
});
