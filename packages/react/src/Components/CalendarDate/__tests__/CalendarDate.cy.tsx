// ** Local Imports
import { CalendarDate } from "@/Components/CalendarDate";

test("it should render the date grid", () => {
  cy.mount(<CalendarDate viewDate={new Date(2021, 4, 1)} />);

  cy.contains("21").should("be.visible");
});

test("it should highlight the selected day", () => {
  cy.mount(
    <CalendarDate
      value={new Date(2021, 4, 21)}
      viewDate={new Date(2021, 4, 1)}
    />,
  );

  cy.contains("button", "21").should("have.attr", "aria-pressed", "true");
});
