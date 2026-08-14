// ** Local Imports
import { Toggle } from "@/Components/Toggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

test("it should render toggle group in the browser", () => {
  cy.mount(
    <ToggleGroup color="success" defaultValue="vue" aria-label="Library">
      <Toggle value="react">React</Toggle>
      <Toggle value="vue">Vue</Toggle>
    </ToggleGroup>,
  );

  cy.get('[role="radiogroup"]').should("exist");
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Vue");
  cy.get('[role="radio"][aria-checked="true"]').should(
    "have.class",
    "bg-success-500/15",
  );
});
