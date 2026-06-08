// ** Local Imports
import { Toggle } from "@/Components/Toggle";

test("it should render with main label", () => {
  cy.mount(Toggle, { props: { mainLabel: "Notifications" } });

  cy.contains("Notifications").should("be.visible");
  cy.get('input[role="switch"]').should("exist");
});

test("it should emit update:modelValue when toggled", () => {
  cy.mount(Toggle, {
    props: {
      modelValue: false,
      mainLabel: "Notifications",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('input[role="switch"]').click({ force: true });
  cy.get("@onUpdate").should("have.been.calledWith", true);
});

test("it should render description when description prop is provided", () => {
  cy.mount(Toggle, {
    props: {
      mainLabel: "Notifications",
      description: "Enable push notifications",
    },
  });

  cy.contains("Enable push notifications").should("be.visible");
});

test("it should render error message when error is set", () => {
  cy.mount(Toggle, {
    props: {
      error: true,
      errorMessage: "Required",
      mainLabel: "Notifications",
    },
  });

  cy.contains("Required").should("be.visible");
  cy.get('input[role="switch"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Toggle, {
    props: { disabled: true, mainLabel: "Notifications" },
  });

  cy.get('input[role="switch"]').should("be.disabled");
});

test("it should reflect checked state from modelValue", () => {
  cy.mount(Toggle, {
    props: { modelValue: true, mainLabel: "Notifications" },
  });

  cy.get('input[role="switch"]').should("be.checked");
});
