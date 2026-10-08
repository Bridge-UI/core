// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";

test("it should list each series in the legend", () => {
  cy.mount(ChartScatter, {
    slots: {
      default: () => [
        h(ChartScatterSeries, { data: [[1, 2]], name: "Customers" }),
        h(ChartScatterSeries, { name: "Leads", data: [[3, 4]] }),
        h(ChartLegend),
      ],
    },
  });

  cy.contains("button", "Customers").should("be.visible");
  cy.contains("button", "Leads").should("be.visible");
});
