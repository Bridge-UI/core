// ** External Imports
import { useState } from "react";

// ** Local Imports
import { TimePanel } from "@/Components/TimePanel";

function TimePanelHarness({
  initialValue = new Date(2021, 4, 21, 9, 30),
}: {
  initialValue?: Date;
}) {
  const [value, setValue] = useState(initialValue);

  return <TimePanel value={value} onChange={setValue} />;
}

test("it should render time columns", () => {
  cy.mount(<TimePanel value={new Date(2021, 4, 21, 9, 30)} />);

  cy.get('button[aria-label="Hour 09"]').should("be.visible");
  cy.get('button[aria-label="Minute 30"]').should("be.visible");
});

test("it should scroll a column and select a time", () => {
  cy.mount(<TimePanelHarness />);

  cy.get('button[aria-label="Hour 23"]').click();
  cy.get('button[aria-label="Hour 23"]').should(
    "have.attr",
    "aria-pressed",
    "true",
  );
});
