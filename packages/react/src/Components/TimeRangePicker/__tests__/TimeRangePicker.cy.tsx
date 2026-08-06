// ** Local Imports
import { TimeRangePicker } from "@/Components/TimeRangePicker";

test("it should render dual time panels", () => {
  cy.mount(
    <TimeRangePicker
      defaultValue={[
        new Date(2021, 4, 21, 9, 30),
        new Date(2021, 4, 21, 17, 0),
      ]}
    />,
  );

  cy.get('button[aria-label="Hour 09"]').should("be.visible");
  cy.get('button[aria-label="Hour 17"]').should("be.visible");
});

test("it should show footer when enabled", () => {
  cy.mount(<TimeRangePicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
