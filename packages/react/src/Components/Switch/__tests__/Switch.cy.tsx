// ** Local Imports
import { Switch } from "@/Components/Switch";

test("it should render with main label", () => {
  cy.mount(<Switch mainLabel="Notifications" />);

  cy.get('input[role="switch"]').should("exist");
  cy.contains("Notifications").should("be.visible");
});

test("it should toggle when clicked in uncontrolled mode", () => {
  cy.mount(<Switch mainLabel="Notifications" defaultChecked={false} />);

  cy.get('input[role="switch"]')
    .should("not.be.checked")
    .click({ force: true })
    .should("be.checked");
});

test("it should render description when description prop is provided", () => {
  cy.mount(
    <Switch
      mainLabel="Notifications"
      description="Enable push notifications"
    />,
  );

  cy.contains("Enable push notifications").should("be.visible");
});

test("it should render error message when error is set", () => {
  cy.mount(<Switch mainLabel="Notifications" error errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get('input[role="switch"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Switch mainLabel="Notifications" disabled />);

  cy.get('input[role="switch"]').should("be.disabled");
});

test("it should reflect checked state when controlled", () => {
  cy.mount(<Switch mainLabel="Notifications" checked />);

  cy.get('input[role="switch"]').should("be.checked");
});
