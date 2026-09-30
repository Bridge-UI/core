// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartSeries } from "@/Components/ChartSeries";

test("it should draw the axis title", () => {
  cy.mount(
    <Chart categories={["Jan", "Feb"]}>
      <ChartSeries name="A" data={[1, 2]} />
      <ChartAxis position="x" label="Month" />
    </Chart>,
  );

  cy.get("[role='img'] svg").should("contain.text", "Month");
});
