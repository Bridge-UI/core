// ** Local Imports
import { CalendarMonth } from "@/Components/CalendarMonth";

test("it should render months", () => {
  cy.mount(<CalendarMonth value={4} year={2021} />);

  cy.contains("button", /may/i).should("have.attr", "aria-pressed", "true");
});
