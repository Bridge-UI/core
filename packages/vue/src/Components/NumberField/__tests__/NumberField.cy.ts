// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render a number input with stepper buttons", () => {
  cy.mount(NumberField);

  cy.get('input[type="number"]').should("exist");
  cy.get('button[aria-label="Increment value"]').should("exist");
  cy.get('button[aria-label="Decrement value"]').should("exist");
});

test("it should increment value when increment button is clicked", () => {
  cy.mount(NumberField, {
    props: {
      modelValue: 1,
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('button[aria-label="Increment value"]').click();
  cy.get("@onUpdate").should("have.been.calledWith", 2);
});

test("it should render a label when label prop is provided", () => {
  cy.mount(NumberField, { props: { label: "Quantity" } });

  cy.contains("Quantity").should("be.visible");
});

test("it should disable stepper buttons when disabled", () => {
  cy.mount(NumberField, { props: { disabled: true } });

  cy.get('button[aria-label="Increment value"]').should("be.disabled");
  cy.get('button[aria-label="Decrement value"]').should("be.disabled");
});
