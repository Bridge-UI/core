// ** Local Imports
import { Calendar } from "@/Components/Calendar";

test("it should render month and year selectors", () => {
  cy.mount(Calendar, { props: { viewDate: new Date(2021, 4, 1) } });

  cy.get('[aria-label="Select year"]').should("be.visible");
  cy.get('[aria-label="Select month"]').should("be.visible");
});

test("it should render day buttons in the date view", () => {
  cy.mount(Calendar, { props: { viewDate: new Date(2021, 4, 1) } });

  cy.contains("button", "21").should("be.visible");
});
