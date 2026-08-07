// ** Local Imports
import { CalendarYear } from "@/Components/CalendarYear";

test("it should render years", () => {
  cy.mount(<CalendarYear value={2021} />);

  cy.contains("button", "2021").should("have.attr", "aria-pressed", "true");
});
