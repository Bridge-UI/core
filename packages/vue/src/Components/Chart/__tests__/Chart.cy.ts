// ** External Imports
import { h } from "vue";

// ** Local Imports
import { Chart } from "@/Components/Chart";
import { ChartSeries } from "@/Components/ChartSeries";

const categories = ["Jan", "Feb", "Mar", "Apr"];

function revenue() {
  return h(ChartSeries, { name: "Revenue", data: [10, 20, 15, 30] });
}

test("it should render the plot with the configured height", () => {
  cy.mount(Chart, {
    slots: { default: revenue },
    props: { categories, height: 240 },
  });

  cy.get("[role='figure']").should("be.visible");
  cy.get("[role='img']").invoke("outerHeight").should("equal", 240);
  cy.get("[role='img'] svg").should("exist");
});

test("it should keep the data table visually hidden", () => {
  cy.mount(Chart, {
    props: { categories },
    slots: { default: revenue },
  });

  cy.get("table").should("have.class", "sr-only");
});

test("it should keep the data table at 1px with many categories", () => {
  const days = Array.from({ length: 30 }, (_, index) => `Day ${index + 1}`);
  const values = Array.from({ length: 30 }, (_, index) => index);

  cy.mount(Chart, {
    props: { categories: days },
    slots: { default: () => h(ChartSeries, { data: values, name: "Visits" }) },
  });

  cy.get("table").then(($table) => {
    expect($table[0].getBoundingClientRect().height).to.be.at.most(1);
  });
});

test("it should show the empty message", () => {
  cy.mount(Chart, { props: { categories } });

  cy.contains("No data").should("be.visible");
});
