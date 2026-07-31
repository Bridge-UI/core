// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render with end label", () => {
  cy.mount(Radio, {
    props: { value: "a", endLabel: "Option A" },
  });

  cy.contains("Option A").should("be.visible");
  cy.get('input[type="radio"]').should("exist");
});

test("it should emit update:modelValue when selected", () => {
  cy.mount(Radio, {
    props: {
      value: "a",
      modelValue: "b",
      endLabel: "Option A",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('input[type="radio"]').click({ force: true });
  cy.get("@onUpdate").should("have.been.calledWith", "a");
});

test("it should be checked when modelValue matches value", () => {
  cy.mount(Radio, {
    props: { value: "a", modelValue: "a", endLabel: "Option A" },
  });

  cy.get('input[type="radio"]').should("be.checked");
});

test("it should render error message when error is set", () => {
  cy.mount(Radio, {
    props: {
      value: "a",
      error: true,
      endLabel: "Option A",
      errorMessage: "Required",
    },
  });

  cy.contains("Required").should("be.visible");
  cy.get('input[type="radio"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Radio, {
    props: { value: "a", disabled: true, endLabel: "Option A" },
  });

  cy.get('input[type="radio"]').should("be.disabled");
});

test("it should forward name to the native input", () => {
  cy.mount(Radio, {
    props: { value: "a", name: "plan", endLabel: "Option A" },
  });

  cy.get('input[type="radio"]').should("have.attr", "name", "plan");
});
