// ** Local Imports
import { DateTimeRangeField } from "@/Components/DateTimeRangeField";

test("it should render the date time range field", () => {
  cy.mount(<DateTimeRangeField />);

  cy.get("input").should("be.visible");
});

test("it should open picker on focus", () => {
  cy.mount(
    <DateTimeRangeField
      defaultValue={[new Date(2021, 4, 1, 9, 30), new Date(2021, 4, 10, 17, 0)]}
    />,
  );

  cy.get("input").focus();
  cy.get('button[aria-label="Hour 09"]').should("exist");
  cy.get('[aria-label="Select year"]').should("be.visible");
});
