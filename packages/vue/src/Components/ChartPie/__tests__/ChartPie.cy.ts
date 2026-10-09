// ** External Imports
import { h } from "vue";

// ** Local Imports
import { ChartLegend } from "@/Components/ChartLegend";
import { ChartPie } from "@/Components/ChartPie";

const data = [
  { value: 3450, label: "Housing" },
  { value: 1310, label: "Kids" },
  { value: 1240, label: "Groceries" },
];

test("it should draw a donut with center content and a side legend", () => {
  cy.mount(ChartPie, {
    props: { data, height: 220, variant: "donut" },
    slots: {
      center: () => h("strong", "R$ 6,9 mil"),
      default: () => h(ChartLegend, { showPercent: true, position: "right" }),
    },
  });

  cy.get("[role='img'] svg path").should("have.length.at.least", 3);
  cy.contains("R$ 6,9 mil").should("be.visible");
  cy.get("ul").should("be.visible").and("contain.text", "57%");
});

test("it should draw a rose pie", () => {
  cy.mount(ChartPie, {
    props: {
      padAngle: 3,
      rose: "area",
      animation: false,
      data: [
        { value: 3, label: "A" },
        { value: 6, label: "B" },
        { value: 9, label: "C" },
      ],
    },
  });

  cy.get("[role='img'] svg path").should("have.length.at.least", 3);
});
