// ** Local Imports
import { DateTimeRangePicker } from "@/Components/DateTimeRangePicker";

test("it should render the date time range picker", () => {
  cy.mount(
    <DateTimeRangePicker
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 25, 17, 0),
      ]}
    />,
  );

  cy.contains("2021").should("be.visible");
  cy.get('button[aria-label="Hour 09"][aria-pressed="true"]').should(
    "be.visible",
  );
  cy.get('button[aria-label="Hour 17"][aria-pressed="true"]').should(
    "be.visible",
  );
});

test("it should show footer when enabled", () => {
  cy.mount(<DateTimeRangePicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
