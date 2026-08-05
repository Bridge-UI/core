// ** Local Imports
import { CalendarMonth } from "@/Components/CalendarMonth";

test("it should render twelve month buttons", () => {
  cy.mount(CalendarMonth, { props: { year: 2021 } });

  cy.get("button").should("have.length", 12);
});

test("it should highlight the selected month", () => {
  cy.mount(CalendarMonth, { props: { value: 4, year: 2021 } });

  cy.contains("button", /may/i).should("have.attr", "aria-pressed", "true");
});
