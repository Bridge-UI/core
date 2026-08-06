// ** Local Imports
import { DateTimeRangeField } from "@/Components/DateTimeRangeField";

test("it should render the date-time range input", () => {
  cy.mount(DateTimeRangeField, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
    },
  });

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(DateTimeRangeField, {
    props: {
      defaultValue: [
        new Date(2021, 4, 21, 14, 30),
        new Date(2021, 4, 25, 17, 0),
      ],
    },
  });

  cy.get("input").click();
  cy.contains("2021").should("be.visible");
});
