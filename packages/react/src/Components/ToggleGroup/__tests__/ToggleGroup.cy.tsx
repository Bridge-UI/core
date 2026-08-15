// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

test("it should render toggle group in the browser", () => {
  cy.mount(
    <ToggleGroup color="success" defaultValue="vue" aria-label="Library">
      <ToggleItem value="react">React</ToggleItem>
      <ToggleItem value="vue">Vue</ToggleItem>
    </ToggleGroup>,
  );

  cy.get('[role="radiogroup"]').should("exist");
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Vue");
  cy.get('[role="radio"][aria-checked="true"]').should(
    "have.class",
    "bg-success-500/15",
  );
});
