// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render with default props", () => {
  cy.mount(NumberField, { attrs: { "aria-label": "Amount" } });

  cy.get("input").should("exist").and("have.attr", "type", "number");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(NumberField, { props: { label: "Quantity" } });

  cy.contains("Quantity").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(NumberField, {
    props: { description: "Helper text" },
    attrs: { "aria-label": "Amount" },
  });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(NumberField, {
    props: { error: true, errorMessage: "Required" },
    attrs: { "aria-label": "Amount" },
  });

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(NumberField, {
    props: { disabled: true },
    attrs: { "aria-label": "Amount" },
  });

  cy.get("input").should("be.disabled");
  cy.get("button[aria-label='Increment value']").should("be.disabled");
  cy.get("button[aria-label='Decrement value']").should("be.disabled");
});

test("it should render increment and decrement buttons", () => {
  cy.mount(NumberField, { attrs: { "aria-label": "Amount" } });

  cy.get("button[aria-label='Increment value']").should("exist");
  cy.get("button[aria-label='Decrement value']").should("exist");
});

test("it should increment modelValue when increment is clicked", () => {
  const onUpdateModelValue = cy.stub().as("onUpdateModelValue");

  cy.mount(NumberField, {
    props: {
      modelValue: 1,
      "onUpdate:modelValue": onUpdateModelValue,
    },
    attrs: { "aria-label": "Amount" },
  });

  cy.get("button[aria-label='Increment value']").click();
  cy.get("@onUpdateModelValue").should("have.been.calledWith", 2);
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

test("it should forward fallthrough attrs to the input", () => {
  cy.mount(NumberField, {
    attrs: {
      id: "field-id",
      placeholder: "0",
      "aria-label": "Amount",
    },
  });

  cy.get("#field-id").should("exist").and("have.attr", "placeholder", "0");
});

test("it should merge class with root classes", () => {
  cy.mount(NumberField, {
    props: { class: "custom-field" },
    attrs: { "aria-label": "Amount" },
  });

  cy.get(".w-full").should("have.class", "custom-field");
});

test("it should apply custom increment and decrement classes", () => {
  cy.mount(NumberField, {
    attrs: { "aria-label": "Amount" },
    props: {
      classes: { increment: "custom-increment", decrement: "custom-decrement" },
    },
  });

  cy.get("button.custom-increment").should("exist");
  cy.get("button.custom-decrement").should("exist");
});
