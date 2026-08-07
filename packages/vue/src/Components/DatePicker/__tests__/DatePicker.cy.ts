// ** Local Imports
import { DatePicker } from "@/Components/DatePicker";

test("it should render the calendar header", () => {
  cy.mount(DatePicker, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get('[aria-label="Select year"]').should("be.visible");
});

test("it should size the root to its content", () => {
  cy.mount(DatePicker, { props: { defaultValue: new Date(2021, 4, 21) } });

  cy.get('[aria-label="Select year"]')
    .closest(".w-fit")
    .should(($root) => {
      expect($root[0].getBoundingClientRect().width).to.be.lessThan(400);
    });
});

test("it should show footer when showFooter is set", () => {
  cy.mount(DatePicker, { props: { showFooter: true } });

  cy.contains("button", "Cancel").should("be.visible");
  cy.contains("button", "Apply").should("be.visible");
});
