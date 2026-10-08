// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartAxis } from "@/Components/ChartAxis";
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

test("it should draw the axis title", () => {
  cy.mount(ChartLine, {
    props: { categories: ["Jan", "Feb"] },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "A", data: [1, 2] }),
        h(ChartAxis, { position: "x", label: "Month" }),
      ],
    },
  });

  cy.get("[role='img'] svg").should("contain.text", "Month");
});
