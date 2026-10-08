// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

test("it should toggle a series from the legend", () => {
  cy.mount(ChartLine, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartLineSeries, { data: [1, 2], name: "Revenue" }),
        h(ChartLineSeries, { data: [2, 1], name: "Costs" }),
        h(ChartLegend),
      ],
    },
  });

  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "true");
  cy.contains("button", "Revenue").click();
  cy.contains("button", "Revenue").should("have.attr", "aria-pressed", "false");
});

test("it should paint swatches with the series color", () => {
  cy.mount(ChartLine, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartLineSeries, { data: [1, 2], name: "Revenue" }),
        h(ChartLegend),
      ],
    },
  });

  cy.get("button span[aria-hidden='true']")
    .should("have.attr", "style")
    .and("match", /background-color/);
});
