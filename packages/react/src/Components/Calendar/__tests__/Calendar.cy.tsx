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

test("it should step months with the wheel when wheelNavigation is set", () => {
  cy.mount(<Calendar wheelNavigation viewDate={new Date(2021, 4, 1)} />);

  cy.get('[aria-label="Select month"]').trigger("wheel", {
    deltaY: 100,
    eventConstructor: "WheelEvent",
  });

  cy.get('[aria-label="Select month"]').should("contain.text", "June");
});
