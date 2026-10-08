// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";

test("it should draw value labels on the bars", () => {
  cy.mount(
    <ChartBar categories={["Q1", "Q2"]}>
      <ChartBarSeries labels name="Orders" data={[1200, 800]} />
    </ChartBar>,
  );

  cy.get("[role='img'] svg").should("contain.text", "1,200");
});
