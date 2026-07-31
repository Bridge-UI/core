// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";

test("it should render with end label", () => {
  cy.mount(Checkbox, { props: { endLabel: "Accept terms" } });

  cy.contains("Accept terms").should("be.visible");
  cy.get('input[type="checkbox"]').should("exist");
});

test("it should emit update:modelValue when toggled", () => {
  cy.mount(Checkbox, {
    props: {
      modelValue: false,
      endLabel: "Accept terms",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('input[type="checkbox"]').click({ force: true });
  cy.get("@onUpdate").should("have.been.calledWith", true);
});

test("it should render description when description prop is provided", () => {
  cy.mount(Checkbox, {
    props: {
      endLabel: "Accept",
      description: "You must accept to continue",
    },
  });

  cy.contains("You must accept to continue").should("be.visible");
});

test("it should render error message when error is set", () => {
  cy.mount(Checkbox, {
    props: {
      error: true,
      endLabel: "Accept",
      errorMessage: "Required",
    },
  });

  cy.contains("Required").should("be.visible");
  cy.get('input[type="checkbox"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Checkbox, {
    props: { disabled: true, endLabel: "Accept" },
  });

  cy.get('input[type="checkbox"]').should("be.disabled");
});

test("it should reflect checked state from modelValue", () => {
  cy.mount(Checkbox, {
    props: { modelValue: true, endLabel: "Accept" },
  });

  cy.get('input[type="checkbox"]').should("be.checked");
});

test("it should start checked and toggle freely with defaultChecked", () => {
  cy.mount(Checkbox, {
    props: { endLabel: "Accept", defaultChecked: true },
  });

  cy.get('input[type="checkbox"]').should("be.checked");

  cy.get('input[type="checkbox"]').click({ force: true });
  cy.get('input[type="checkbox"]').should("not.be.checked");

  cy.get('input[type="checkbox"]').click({ force: true });
  cy.get('input[type="checkbox"]').should("be.checked");
});
