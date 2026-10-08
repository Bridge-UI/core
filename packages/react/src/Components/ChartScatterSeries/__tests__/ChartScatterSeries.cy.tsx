// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";

test("it should list each series in the legend", () => {
  cy.mount(
    <ChartScatter>
      <ChartScatterSeries data={[[1, 2]]} name="Customers" />
      <ChartScatterSeries name="Leads" data={[[3, 4]]} />
      <ChartLegend />
    </ChartScatter>,
  );

  cy.contains("button", "Customers").should("be.visible");
  cy.contains("button", "Leads").should("be.visible");
});
