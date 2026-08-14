// ** Local Imports
import { Toggle } from "@/Components/Toggle";
import { ToggleGroup } from "@/Components/ToggleGroup";

test("it should render a toggle in the browser", () => {
  cy.mount(
    <ToggleGroup defaultValue="a" aria-label="Options">
      <Toggle value="a">Alpha</Toggle>
      <Toggle value="b">Beta</Toggle>
    </ToggleGroup>,
  );

  cy.get('[role="radio"]').should("have.length", 2);
  cy.contains("Alpha").click();
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Alpha");
});
