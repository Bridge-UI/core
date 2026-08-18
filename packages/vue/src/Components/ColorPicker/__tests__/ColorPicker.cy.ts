// ** Local Imports
import { ColorPicker } from "@/Components/ColorPicker";

test("it should render the color picker", () => {
  cy.mount(ColorPicker, { props: { defaultValue: "#ea1212" } });

  cy.contains("#ea1212").should("be.visible");
});

test("it should show footer when showFooter is set", () => {
  cy.mount(ColorPicker, { props: { showFooter: true } });

  cy.contains("button", "Cancel").should("be.visible");
  cy.contains("button", "Apply").should("be.visible");
});
