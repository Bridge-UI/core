// ** Local Imports
import { ChartFunnel } from "@/Components/ChartFunnel";

test("it should draw one shape per stage with labels", () => {
  cy.mount(
    <ChartFunnel
      height={240}
      data={[
        { value: 1200, label: "Visited" },
        { value: 420, label: "Signed up" },
        { value: 96, label: "Paid" },
      ]}
    />,
  );

  cy.get("[role='img'] svg path").should("have.length.at.least", 3);
  cy.get("[role='img'] svg").should("contain.text", "Signed up");
});
