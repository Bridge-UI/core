// ** Local Imports
import { TimePicker } from "@/Components/TimePicker";

test("it should render time columns", () => {
  cy.mount(TimePicker, {
    props: { defaultValue: new Date(2021, 4, 21, 14, 30) },
  });

  cy.get("button").should("have.length.greaterThan", 24);
});

test("it should show footer when showFooter is set", () => {
  cy.mount(TimePicker, { props: { showFooter: true } });

  cy.contains("button", "Cancel").should("be.visible");
  cy.contains("button", "Apply").should("be.visible");
});
