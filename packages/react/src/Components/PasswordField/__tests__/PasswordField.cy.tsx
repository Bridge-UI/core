// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render with default props", () => {
  cy.mount(<PasswordField aria-label="Password" />);

  cy.get("input").should("exist").and("have.attr", "type", "password");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<PasswordField label="Password" id="password-field" />);

  cy.contains("Password").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<PasswordField description="Helper text" aria-label="Password" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(
    <PasswordField error errorMessage="Required" aria-label="Password" />,
  );

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<PasswordField disabled aria-label="Password" />);

  cy.get("input").should("be.disabled");
  cy.get("button").should("be.disabled");
});

test("it should toggle password visibility", () => {
  cy.mount(<PasswordField aria-label="Password" />);

  cy.get("input").should("have.attr", "type", "password");
  cy.get("button[aria-label='Show password']").click();
  cy.get("input").should("have.attr", "type", "text");
  cy.get("button[aria-label='Hide password']").click();
  cy.get("input").should("have.attr", "type", "password");
});

test("it should not render error icon when error is set", () => {
  cy.mount(<PasswordField error aria-label="Password" />);

  cy.get(".lucide-circle-alert").should("not.exist");
});

test("it should forward native input attributes", () => {
  cy.mount(
    <PasswordField
      id="field-id"
      placeholder="Enter password"
      aria-label="Password"
    />,
  );

  cy.get("#field-id")
    .should("exist")
    .and("have.attr", "placeholder", "Enter password");
});

test("it should merge className with root classes", () => {
  cy.mount(<PasswordField className="custom-field" aria-label="Password" />);

  cy.get(".w-full").should("have.class", "custom-field");
});

test("it should apply custom toggle class", () => {
  cy.mount(
    <PasswordField
      aria-label="Password"
      classes={{ toggle: "custom-toggle" }}
    />,
  );

  cy.get("button.custom-toggle").should("exist");
});
