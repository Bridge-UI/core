// ** Local Imports
import { TimeRangeField } from "@/Components/TimeRangeField";

test("it should render the time range input", () => {
  cy.mount(
    <TimeRangeField
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  cy.get("input").should("exist");
});

test("it should open the picker on click", () => {
  cy.mount(
    <TimeRangeField
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  cy.get("input").click();
  cy.get('button[aria-label="Hour 09"][aria-pressed="true"]').should(
    "be.visible",
  );
  cy.get('button[aria-label="Hour 17"][aria-pressed="true"]').should(
    "be.visible",
  );
});
