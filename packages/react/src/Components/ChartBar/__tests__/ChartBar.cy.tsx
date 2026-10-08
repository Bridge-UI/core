// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

const categories = ["Housing", "Kids", "Food"];

test("it should render vertical bars", () => {
  cy.mount(
    <ChartBar height={240} categories={categories}>
      <ChartBarSeries name="October" data={[3450, 1310, 1240]} />
    </ChartBar>,
  );

  cy.get("[role='img']").invoke("outerHeight").should("equal", 240);
  cy.get("[role='img'] svg path").should("have.length.at.least", 3);
});

test("it should render horizontal stacked bars with labels", () => {
  cy.mount(
    <ChartBar
      labels
      stack="total"
      categories={categories}
      orientation="horizontal"
    >
      <ChartBarSeries name="October" data={[3450, 1310, 1240]} />
      <ChartBarSeries name="November" data={[3300, 1200, 900]} />
    </ChartBar>,
  );

  cy.get("[role='img'] svg").should("contain.text", "Housing");
  cy.get("[role='img'] svg").should("contain.text", "3,450");
});

test("it should draw a line over the bars", () => {
  cy.mount(
    <ChartBar categories={categories}>
      <ChartBarSeries name="Orders" data={[30, 20, 10]} />
      <ChartLineSeries showPoints name="Returns" data={[3, 4, 2]} />
    </ChartBar>,
  );

  cy.get("[role='img'] svg path[fill='none']").should("exist");
});
