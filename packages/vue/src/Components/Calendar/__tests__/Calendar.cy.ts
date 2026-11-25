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

test("it should step months with the wheel when wheelNavigation is set", () => {
  cy.mount(Calendar, {
    props: { wheelNavigation: true, viewDate: new Date(2021, 4, 1) },
  });

  cy.get('[aria-label="Select month"]').trigger("wheel", {
    deltaY: 100,
    eventConstructor: "WheelEvent",
  });

  cy.get('[aria-label="Select month"]').should("contain.text", "June");
});
