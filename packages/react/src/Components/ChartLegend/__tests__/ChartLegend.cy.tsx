// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartSeries } from "@/Components/ChartSeries";

test("it should toggle a series from the legend", () => {
  cy.mount(
    <Chart categories={["Jan", "Feb"]}>
      <ChartSeries data={[1, 2]} name="Revenue" />
      <ChartSeries name="Costs" data={[2, 1]} />
      <ChartLegend />
    </Chart>,
  );

  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "true");
  cy.contains("button", "Revenue").click();
  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "false");
});

test("it should paint swatches with the series color", () => {
  cy.mount(
    <Chart categories={["Jan", "Feb"]}>
      <ChartSeries data={[1, 2]} name="Revenue" />
      <ChartLegend />
    </Chart>,
  );

  cy.get("button span[aria-hidden='true']")
    .should("have.attr", "style")
    .and("match", /background-color/);
});
