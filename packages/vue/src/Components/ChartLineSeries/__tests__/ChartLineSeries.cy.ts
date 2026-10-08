// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

test("it should draw a reference line with its label", () => {
  cy.mount(ChartLine, {
    props: { categories: ["Jan", "Feb", "Mar"] },
    slots: {
      default: () =>
        h(ChartLineSeries, {
          name: "Revenue",
          data: [10, 20, 30],
          reference: { value: 25, label: "Goal" },
        }),
    },
  });

  cy.get("[role='img'] svg").should("contain.text", "Goal");
});
