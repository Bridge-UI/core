// ** Local Imports
import { CalendarDate } from "@/Components/CalendarDate";

test("it should render the date grid", () => {
  cy.mount(CalendarDate, {
    props: { viewDate: new Date(2021, 4, 1) },
  });

  cy.contains("21").should("be.visible");
});

test("it should highlight the selected day", () => {
  cy.mount(CalendarDate, {
    props: {
      viewDate: new Date(2021, 4, 1),
      modelValue: new Date(2021, 4, 21),
    },
  });

  cy.contains("button", "21").should("have.attr", "aria-pressed", "true");
});
