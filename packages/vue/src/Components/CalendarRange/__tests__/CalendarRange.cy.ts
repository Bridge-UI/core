// ** Local Imports
import { CalendarRange } from "@/Components/CalendarRange";

test("it should render two calendars", () => {
  cy.mount(CalendarRange, {
    props: {
      defaultValue: [new Date(2021, 4, 1), new Date(2021, 4, 10)],
    },
  });

  cy.contains("May").should("be.visible");
  cy.contains("June").should("be.visible");
});
