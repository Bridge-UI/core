// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";

test("it should draw a dashed reference line with its label", () => {
  cy.mount(
    <ChartLine categories={["Jan", "Feb", "Mar"]}>
      <ChartLineSeries
        name="Revenue"
        data={[10, 20, 30]}
        reference={{ value: 25, label: "Goal" }}
      />
    </ChartLine>,
  );

  cy.get("[role='img'] svg").should("contain.text", "Goal");
});
