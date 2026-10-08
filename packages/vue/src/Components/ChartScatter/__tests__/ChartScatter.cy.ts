// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";

test("it should draw points and bubbles", () => {
  cy.mount(ChartScatter, {
    props: { height: 240 },
    slots: {
      default: () => [
        h(ChartScatterSeries, {
          name: "Customers",
          data: [
            [24, 340, 2],
            [31, 520, 8],
          ],
        }),
        h(ChartScatterSeries, { name: "Leads", data: [[40, 100]] }),
      ],
    },
  });

  cy.get("[role='img']").invoke("outerHeight").should("equal", 240);
  cy.get("[role='img'] svg path").should("have.length.at.least", 3);
});
