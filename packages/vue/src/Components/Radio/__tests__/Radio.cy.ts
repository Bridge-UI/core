// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render with main label", () => {
  cy.mount(Radio, {
    props: { value: "a", mainLabel: "Option A" },
  });

  cy.contains("Option A").should("be.visible");
  cy.get('input[type="radio"]').should("exist");
});

test("it should emit update:modelValue when selected", () => {
  cy.mount(Radio, {
    props: {
      value: "a",
      modelValue: "b",
      mainLabel: "Option A",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('input[type="radio"]').click({ force: true });
  cy.get("@onUpdate").should("have.been.calledWith", "a");
});

test("it should be checked when modelValue matches value", () => {
  cy.mount(Radio, {
    props: { value: "a", modelValue: "a", mainLabel: "Option A" },
  });

  cy.get('input[type="radio"]').should("be.checked");
});

test("it should render error message when error is set", () => {
  cy.mount(Radio, {
    props: {
      value: "a",
      error: true,
      mainLabel: "Option A",
      errorMessage: "Required",
    },
  });

  cy.contains("Required").should("be.visible");
  cy.get('input[type="radio"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Radio, {
    props: { value: "a", mainLabel: "Option A", disabled: true },
  });

  cy.get('input[type="radio"]').should("be.disabled");
});

test("it should forward name to the native input", () => {
  cy.mount(Radio, {
    props: { value: "a", name: "plan", mainLabel: "Option A" },
  });

  cy.get('input[type="radio"]').should("have.attr", "name", "plan");
});
