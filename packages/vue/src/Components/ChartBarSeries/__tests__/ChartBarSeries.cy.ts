// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartBar } from "@/Components/ChartBar";
import { ChartBarSeries } from "@/Components/ChartBarSeries";

test("it should draw value labels on the bars", () => {
  cy.mount(ChartBar, {
    props: { categories: ["Q1", "Q2"] },
    slots: {
      default: () =>
        h(ChartBarSeries, { labels: true, name: "Orders", data: [1200, 800] }),
    },
  });

  cy.get("[role='img'] svg").should("contain.text", "1,200");
});
