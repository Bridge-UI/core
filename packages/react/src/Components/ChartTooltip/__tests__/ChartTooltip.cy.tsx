// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";

test("it should open from keyboard focus", () => {
  cy.mount(
    <Chart categories={["Jan", "Feb", "Mar"]}>
      <ChartSeries name="Revenue" data={[10, 20, 30]} />
      <ChartTooltip data-testid="tooltip" />
    </Chart>,
  );

  cy.get("[role='img']").focus().type("{rightarrow}");
  cy.get("[data-testid='tooltip']")
    .should("be.visible")
    .and("contain.text", "Jan");
});
