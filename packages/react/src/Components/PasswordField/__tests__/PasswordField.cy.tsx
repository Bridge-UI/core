// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render a password input with visibility toggle", () => {
  cy.mount(<PasswordField aria-label="Password" />);

  cy.get('input[type="password"]').should("exist");
  cy.get('button[aria-label="Show password"]').should("exist");
});

test("it should reveal password when toggle is clicked", () => {
  cy.mount(<PasswordField aria-label="Password" />);

  cy.get('button[aria-label="Show password"]').click();
  cy.get('input[type="text"]').should("exist");
  cy.get('button[aria-label="Hide password"]').should("exist");
});

test("it should toggle back to password when hide is clicked", () => {
  cy.mount(<PasswordField aria-label="Password" />);

  cy.get('button[aria-label="Show password"]').click();
  cy.get('button[aria-label="Hide password"]').click();
  cy.get('input[type="password"]').should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<PasswordField label="Password" aria-label="Password field" />);

  cy.contains("Password").should("be.visible");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<PasswordField disabled aria-label="Password" />);

  cy.get("input").should("be.disabled");
  cy.get("button").should("be.disabled");
});

test("it should not render error icon when error is set", () => {
  cy.mount(<PasswordField error aria-label="Password" />);

  cy.get(".lucide-circle-alert").should("not.exist");
});
