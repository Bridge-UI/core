// ** Local Imports
import { TimePanel } from "@/Components/TimePanel";

test("it should render time columns", () => {
  cy.mount(TimePanel, { props: { value: new Date(2021, 4, 21, 14, 30) } });

  cy.get("button").should("have.length.greaterThan", 24);
});

test("it should highlight the selected hour", () => {
  cy.mount(TimePanel, { props: { value: new Date(2021, 4, 21, 14, 30) } });

  cy.contains("button", "14").should("have.attr", "aria-pressed", "true");
});
