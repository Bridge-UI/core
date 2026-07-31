// ** Local Imports
import { Switch } from "@/Components/Switch";

test("it should render with end label", () => {
  cy.mount(Switch, { props: { endLabel: "Notifications" } });

  cy.contains("Notifications").should("be.visible");
  cy.get('input[role="switch"]').should("exist");
});

test("it should emit update:modelValue when toggled", () => {
  cy.mount(Switch, {
    props: {
      modelValue: false,
      endLabel: "Notifications",
      "onUpdate:modelValue": cy.stub().as("onUpdate"),
    },
  });

  cy.get('input[role="switch"]').click({ force: true });
  cy.get("@onUpdate").should("have.been.calledWith", true);
});

test("it should render description when description prop is provided", () => {
  cy.mount(Switch, {
    props: {
      endLabel: "Notifications",
      description: "Enable push notifications",
    },
  });

  cy.contains("Enable push notifications").should("be.visible");
});

test("it should render error message when error is set", () => {
  cy.mount(Switch, {
    props: {
      error: true,
      errorMessage: "Required",
      endLabel: "Notifications",
    },
  });

  cy.contains("Required").should("be.visible");
  cy.get('input[role="switch"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(Switch, {
    props: { disabled: true, endLabel: "Notifications" },
  });

  cy.get('input[role="switch"]').should("be.disabled");
});

test("it should reflect checked state from modelValue", () => {
  cy.mount(Switch, {
    props: { modelValue: true, endLabel: "Notifications" },
  });

  cy.get('input[role="switch"]').should("be.checked");
});

test("it should start on and toggle freely with defaultChecked", () => {
  cy.mount(Switch, {
    props: { defaultChecked: true, endLabel: "Notifications" },
  });

  cy.get('input[role="switch"]').should("be.checked");

  cy.get('input[role="switch"]').click({ force: true });
  cy.get('input[role="switch"]').should("not.be.checked");

  cy.get('input[role="switch"]').click({ force: true });
  cy.get('input[role="switch"]').should("be.checked");
});
