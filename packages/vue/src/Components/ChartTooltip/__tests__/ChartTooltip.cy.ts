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

test("it should open above a sparkline instead of covering it", () => {
  cy.mount(ChartLine, {
    attrs: { style: { marginTop: "120px" } },
    props: {
      sparkline: true,
      animation: false,
      categories: ["W1", "W2", "W3"],
    },
    slots: {
      default: () => [
        h(ChartLineSeries, {
          area: true,
          name: "Balance",
          data: [8200, 8900, 8600],
        }),
        h(ChartTooltip, { "data-testid": "tooltip" }),
      ],
    },
  });

  cy.get("[role='img']").focus().type("{rightarrow}{rightarrow}");

  cy.get("[role='figure']").then((root) => {
    const figure = root[0].getBoundingClientRect();

    cy.get("[data-testid='tooltip']").should(([tooltip]) => {
      expect(tooltip.getBoundingClientRect().top).to.be.below(figure.top);
    });
  });
});
