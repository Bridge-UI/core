// ** Local Imports
import { TimePanel } from "@/Components/TimePanel";

test("it should render time columns", () => {
  cy.mount(<TimePanel value={new Date(2021, 4, 21, 9, 30)} />);

  cy.get('button[aria-label="Hour 09"]').should("be.visible");
  cy.get('button[aria-label="Minute 30"]').should("be.visible");
});
