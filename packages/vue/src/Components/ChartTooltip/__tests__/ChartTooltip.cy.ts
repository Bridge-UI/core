// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";

function mountChart() {
  cy.mount(ChartLine, {
    props: { categories: ["Jan", "Feb", "Mar"] },
    slots: {
      default: () => [
        h(ChartLineSeries, { name: "Revenue", data: [10, 20, 30] }),
        h(ChartTooltip, { "data-testid": "tooltip" }),
      ],
    },
  });
}

test("it should open from keyboard focus", () => {
  mountChart();

  cy.get("[role='img']").focus().type("{rightarrow}");
  cy.get("[data-testid='tooltip']")
    .should("be.visible")
    .and("contain.text", "Jan");
});
