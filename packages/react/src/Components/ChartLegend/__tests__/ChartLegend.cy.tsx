// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

test("it should toggle a series from the legend", () => {
  cy.mount(
    <ChartLine categories={["Jan", "Feb"]}>
      <ChartLineSeries data={[1, 2]} name="Revenue" />
      <ChartLineSeries name="Costs" data={[2, 1]} />
      <ChartLegend />
    </ChartLine>,
  );

  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "true");
  cy.contains("button", "Revenue").click();
  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "false");
});

test("it should paint swatches with the series color", () => {
  cy.mount(
    <ChartLine categories={["Jan", "Feb"]}>
      <ChartLineSeries data={[1, 2]} name="Revenue" />
      <ChartLegend />
    </ChartLine>,
  );

  cy.get("button span[aria-hidden='true']")
    .should("have.attr", "style")
    .and("match", /background-color/);
});
