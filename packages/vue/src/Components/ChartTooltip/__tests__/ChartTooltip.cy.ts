// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";

function mountChart() {
  cy.mount(Chart, {
    props: { categories: ["Jan", "Feb", "Mar"] },
    slots: {
      default: () => [
        h(ChartSeries, { name: "Revenue", data: [10, 20, 30] }),
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
