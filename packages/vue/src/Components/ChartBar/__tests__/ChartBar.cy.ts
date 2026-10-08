// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

const categories = ["Housing", "Kids", "Food"];

test("it should render horizontal stacked bars with labels", () => {
  cy.mount(ChartBar, {
    props: {
      categories,
      labels: true,
      stack: "total",
      orientation: "horizontal",
    },
    slots: {
      default: () => [
        h(ChartBarSeries, { name: "October", data: [3450, 1310, 1240] }),
        h(ChartBarSeries, { name: "November", data: [3300, 1200, 900] }),
      ],
    },
  });

  cy.get("[role='img'] svg").should("contain.text", "Housing");
  cy.get("[role='img'] svg").should("contain.text", "3,450");
});

test("it should draw a line over the bars", () => {
  cy.mount(ChartBar, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartBarSeries, { name: "Orders", data: [30, 20, 10] }),
        h(ChartLineSeries, {
          name: "Returns",
          data: [3, 4, 2],
          showPoints: true,
        }),
      ],
    },
  });

  cy.get("[role='img'] svg path[fill='none']").should("exist");
});
