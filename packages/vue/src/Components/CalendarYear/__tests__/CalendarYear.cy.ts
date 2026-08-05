// ** Local Imports
import { CalendarYear } from "@/Components/CalendarYear";

test("it should render a page of year buttons", () => {
  cy.mount(CalendarYear, { props: { value: 2021, pageSize: 15 } });

  cy.get("button").should("have.length", 15);
});

test("it should highlight the selected year", () => {
  cy.mount(CalendarYear, { props: { value: 2021 } });

  cy.contains("button", "2021").should("have.attr", "aria-pressed", "true");
});
