// ** Local Imports
import { ToggleGroup } from "@/Components/ToggleGroup";
import { ToggleItem } from "@/Components/ToggleItem";

test("it should render a toggle item in the browser", () => {
  cy.mount(
    <ToggleGroup defaultValue="a" aria-label="Options">
      <ToggleItem value="a">Alpha</ToggleItem>
      <ToggleItem value="b">Beta</ToggleItem>
    </ToggleGroup>,
  );

  cy.get('[role="radio"]').should("have.length", 2);
  cy.contains("Alpha").click();
  cy.get('[role="radio"][aria-checked="true"]').should("contain", "Alpha");
});
