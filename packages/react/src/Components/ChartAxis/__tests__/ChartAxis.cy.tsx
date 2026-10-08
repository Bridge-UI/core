// ** Local Imports
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

test("it should draw the axis title", () => {
  cy.mount(
    <ChartLine categories={["Jan", "Feb"]}>
      <ChartLineSeries name="A" data={[1, 2]} />
      <ChartAxis position="x" label="Month" />
    </ChartLine>,
  );

  cy.get("[role='img'] svg").should("contain.text", "Month");
});
