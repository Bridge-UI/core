// ** Local Imports
import { DateField } from "@/Components/DateField";

test("it should render the date input", () => {
  cy.mount(DateField, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(DateField, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get("input").click();
  cy.contains("2021").should("be.visible");
});
