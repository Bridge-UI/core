// ** Local Imports
import { ChartScatter } from "@/Components/ChartScatter";
import { ChartScatterSeries } from "@/Components/ChartScatterSeries";

test("it should draw points and bubbles", () => {
  cy.mount(
    <ChartScatter height={240}>
      <ChartScatterSeries
        name="Customers"
        data={[
          [24, 340, 2],
          [31, 520, 8],
        ]}
      />
      <ChartScatterSeries name="Leads" data={[[40, 100]]} />
    </ChartScatter>,
  );

  cy.get("[role='img']").invoke("outerHeight").should("equal", 240);
  cy.get("[role='img'] svg path").should("have.length.at.least", 3);
});
