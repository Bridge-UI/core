// ** Local Imports
import { DateInput } from "@/Components/DateInput";

test("it should render the date input", () => {
  cy.mount(DateInput, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(DateInput, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get("input").click();
  cy.contains("2021").should("be.visible");
});
