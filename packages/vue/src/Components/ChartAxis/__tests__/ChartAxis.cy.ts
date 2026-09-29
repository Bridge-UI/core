// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartSeries } from "@/Components/ChartSeries";

test("it should draw the axis title", () => {
  cy.mount(Chart, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartSeries, { name: "A", data: [1, 2] }),
        h(ChartAxis, { position: "x", label: "Month" }),
      ],
    },
  });

  cy.get("[role='img'] svg").should("contain.text", "Month");
});
