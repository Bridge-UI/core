// ** Local Imports
import { TimeRangePicker } from "@/Components/TimeRangePicker";

test("it should render dual time panels", () => {
  cy.mount(TimeRangePicker, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ],
    },
  });

  cy.get("button").should("have.length.greaterThan", 48);
});

test("it should show footer when showFooter is set", () => {
  cy.mount(TimeRangePicker, { props: { showFooter: true } });

  cy.contains("button", "Cancel").should("be.visible");
  cy.contains("button", "Apply").should("be.visible");
});
