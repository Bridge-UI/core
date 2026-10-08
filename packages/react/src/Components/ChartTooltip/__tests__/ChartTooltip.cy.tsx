// ** Local Imports
import { ChartLine } from "@/Components/ChartLine";
import { ChartLineSeries } from "@/Components/ChartLineSeries";
import { ChartTooltip } from "@/Components/ChartTooltip";

test("it should open from keyboard focus", () => {
  cy.mount(
    <ChartLine categories={["Jan", "Feb", "Mar"]}>
      <ChartLineSeries name="Revenue" data={[10, 20, 30]} />
      <ChartTooltip data-testid="tooltip" />
    </ChartLine>,
  );

  cy.get("[role='img']").focus().type("{rightarrow}");
  cy.get("[data-testid='tooltip']")
    .should("be.visible")
    .and("contain.text", "Jan");
});
