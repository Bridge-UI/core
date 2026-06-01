// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render a password input with visibility toggle", () => {
  cy.mount(<PasswordField />);

  cy.get('input[type="password"]').should("exist");
  cy.get('button[aria-label="Show password"]').should("exist");
});

test("it should reveal password when toggle is clicked", () => {
  cy.mount(<PasswordField modelValue="secret" />);

  cy.get('button[aria-label="Show password"]').click();
  cy.get('input[type="text"]').should("exist");
  cy.get('button[aria-label="Hide password"]').should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<PasswordField label="Password" />);

  cy.contains("Password").should("be.visible");
});
