// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render a number input with stepper buttons", () => {
  cy.mount(NumberField, { attrs: { "aria-label": "Amount" } });

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
    attrs: { "aria-label": "Amount" },
  });

  cy.get('button[aria-label="Increment value"]').click();
  cy.get("@onUpdate").should("have.been.calledWith", 2);
});

test("it should render a label when label prop is provided", () => {
  cy.mount(NumberField, { props: { label: "Quantity" } });

  cy.contains("Quantity").should("be.visible");
});

test("it should disable stepper buttons when disabled", () => {
  cy.mount(NumberField, {
    props: { disabled: true },
    attrs: { "aria-label": "Amount" },
  });

  cy.get('button[aria-label="Increment value"]').should("be.disabled");
  cy.get('button[aria-label="Decrement value"]').should("be.disabled");
});

test("it should forward min, max, and step attributes", () => {
  cy.mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: { min: 0, max: 10, step: 2, modelValue: 4 },
  });

  cy.get("input")
    .should("have.attr", "min", "0")
    .and("have.attr", "max", "10")
    .and("have.attr", "step", "2");
});

test("it should not render error icon when error is set", () => {
  cy.mount(NumberField, {
    props: { error: true },
    attrs: { "aria-label": "Amount" },
  });

  cy.get(".lucide-circle-alert").should("not.exist");
});
