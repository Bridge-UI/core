// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartSeries } from "@/Components/ChartSeries";

test("it should toggle a series from the legend", () => {
  cy.mount(Chart, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartSeries, { data: [1, 2], name: "Revenue" }),
        h(ChartSeries, { data: [2, 1], name: "Costs" }),
        h(ChartLegend),
      ],
    },
  });

  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "true");
  cy.contains("button", "Revenue").click();
  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "false");
});

test("it should paint swatches with the series color", () => {
  cy.mount(Chart, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartSeries, { data: [1, 2], name: "Revenue" }),
        h(ChartLegend),
      ],
    },
  });

  cy.get("button span[aria-hidden='true']")
    .should("have.attr", "style")
    .and("match", /background-color/);
});
