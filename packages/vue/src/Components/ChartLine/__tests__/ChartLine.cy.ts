// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

const categories = ["Jan", "Feb", "Mar", "Apr"];

test("it should render the plot with the configured height", () => {
  cy.mount(ChartLine, {
    props: { categories, height: 240 },
    slots: {
      default: () =>
        h(ChartLineSeries, { name: "Revenue", data: [10, 20, 15, 30] }),
    },
  });

  cy.get("[role='figure']").should("be.visible");
  cy.get("[role='img']").invoke("outerHeight").should("equal", 240);
  cy.get("[role='img'] svg").should("exist");
});

test("it should draw a time axis from date categories", () => {
  cy.mount(ChartLine, {
    props: { categories: [1, 2, 5, 9].map((day) => new Date(2026, 9, day)) },
    slots: {
      default: () =>
        h(ChartLineSeries, {
          area: true,
          name: "Spent",
          data: [10, 20, 15, 30],
        }),
    },
  });

  cy.get("[role='img'] svg").should("contain.text", "Oct");
});

test("it should render a compact sparkline", () => {
  cy.mount(ChartLine, {
    props: { categories, sparkline: true },
    slots: {
      default: () => h(ChartLineSeries, { name: "Trend", data: [3, 5, 4, 8] }),
    },
  });

  cy.get("[role='img']").invoke("outerHeight").should("equal", 48);
  cy.get("[role='img'] svg text").should("not.exist");
});

test("it should show the empty message", () => {
  cy.mount(ChartLine, { props: { categories } });

  cy.contains("No data").should("be.visible");
});

test("it should recolor a line by value ranges", () => {
  cy.mount(ChartLine, {
    props: { area: true, animation: false, categories: ["Jan", "Feb", "Mar"] },
    slots: {
      default: () => [
        h(ChartLineSeries, {
          name: "AQI",
          data: [40, 120, 80],
          colorRanges: [
            { max: 50, color: "#00ff00" },
            { min: 100, color: "#ff0000" },
          ],
        }),
      ],
    },
  });

  cy.get("[role='img'] svg linearGradient").should("exist");
  cy.get("[role='img'] svg path[stroke^='url(']").should("exist");
});
