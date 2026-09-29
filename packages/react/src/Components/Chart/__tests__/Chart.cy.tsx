// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar", "Apr"];

test("it should render the plot with the configured height", () => {
  cy.mount(
    <Chart height={240} categories={categories}>
      <ChartSeries name="Revenue" data={[10, 20, 15, 30]} />
    </Chart>,
  );

  cy.get("[role='figure']").should("be.visible");
  cy.get("[role='img']").invoke("outerHeight").should("equal", 240);
  cy.get("[role='img'] svg").should("exist");
});

test("it should keep the data table visually hidden", () => {
  cy.mount(
    <Chart categories={categories}>
      <ChartSeries name="Revenue" data={[10, 20, 15, 30]} />
    </Chart>,
  );

  cy.get("table").should("have.class", "sr-only");
});

test("it should show the empty message", () => {
  cy.mount(<Chart categories={categories} />);

  cy.contains("No data").should("be.visible");
});
