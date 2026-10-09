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

test("it should paint bars by category and mix muted bars toward the background", () => {
  cy.mount(ChartBar, {
    attrs: { style: { backgroundColor: "rgb(255, 255, 255)" } },
    props: {
      categories,
      animation: false,
      categoryColors: ["#ff0000", "#00ff00", "#0000ff"],
    },
    slots: {
      default: () => [
        h(ChartBarSeries, { name: "October", data: [3, 2, 1] }),
        h(ChartBarSeries, { tone: "muted", name: "Average", data: [3, 2, 1] }),
      ],
    },
  });

  cy.get("[role='img'] svg path").should((paths) => {
    const fills = [...paths].map((path) => path.getAttribute("fill"));

    expect(fills).to.include.members([
      "rgb(255,0,0)",
      "rgb(0,0,255)",
      "rgb(255, 153, 153)",
      "rgb(153, 153, 255)",
    ]);
  });
});
