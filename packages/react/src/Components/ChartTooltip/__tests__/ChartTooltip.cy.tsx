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

test("it should open above a sparkline instead of covering it", () => {
  cy.mount(
    <div style={{ paddingTop: 120 }}>
      <ChartLine sparkline animation={false} categories={["W1", "W2", "W3"]}>
        <ChartLineSeries area name="Balance" data={[8200, 8900, 8600]} />
        <ChartTooltip data-testid="tooltip" />
      </ChartLine>
    </div>,
  );

  cy.get("[role='img']").focus().type("{rightarrow}{rightarrow}");

  cy.get("[role='figure']").then((root) => {
    const figure = root[0].getBoundingClientRect();

    cy.get("[data-testid='tooltip']").should(([tooltip]) => {
      expect(tooltip.getBoundingClientRect().top).to.be.below(figure.top);
    });
  });
});
