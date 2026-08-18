// ** Local Imports
import { ColorPicker } from "@/Components/ColorPicker";

test("it should render the color picker", () => {
  cy.mount(<ColorPicker defaultValue="#ea1212" />);

  cy.contains("#ea1212").should("be.visible");
});

test("it should show footer when enabled", () => {
  cy.mount(<ColorPicker showFooter />);

  cy.contains("button", "Apply").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
});
