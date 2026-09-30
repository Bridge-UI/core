// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

test("it should register one column per series", () => {
  cy.mount(
    <Chart categories={categories}>
      <ChartSeries name="A" data={[1, 2, 3]} />
      <ChartSeries name="B" type="bar" data={[3, 2, 1]} />
    </Chart>,
  );

  cy.contains("th", "A").should("exist");
  cy.contains("th", "B").should("exist");
  cy.get("[role='img'] svg").should("exist");
});
