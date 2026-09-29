// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar"];

test("it should register one column per series", () => {
  cy.mount(Chart, {
    props: { categories },
    slots: {
      default: () => [
        h(ChartSeries, { name: "A", data: [1, 2, 3] }),
        h(ChartSeries, { name: "B", type: "bar", data: [3, 2, 1] }),
      ],
    },
  });

  cy.contains("th", "A").should("exist");
  cy.contains("th", "B").should("exist");
  cy.get("[role='img'] svg").should("exist");
});
