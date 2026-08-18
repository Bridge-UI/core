// ** Local Imports
import { ColorField } from "@/Components/ColorField";

test("it should render the color input", () => {
  cy.mount(ColorField, { props: { defaultValue: "#ea1212" } });

  cy.get("input").should("have.value", "#ea1212");
});

test("it should open the picker on click", () => {
  cy.mount(ColorField, { props: { defaultValue: "#ea1212" } });

  cy.get("input").click();
  cy.contains("#ea1212").should("be.visible");
});
