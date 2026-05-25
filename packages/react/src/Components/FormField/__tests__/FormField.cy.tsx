// ** Local Imports
import { FormField } from "@/Components/FormField";

test("it should render with default props", () => {
  cy.mount(
    <FormField>
      <input aria-label="Field" />
    </FormField>,
  );

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render label from prop", () => {
  cy.mount(
    <FormField label="Email" controlId="email-field">
      <input id="email-field" />
    </FormField>,
  );

  cy.contains("Email").should("be.visible");
  cy.get('label[for="email-field"]').should("exist");
});

test("it should apply error color when error is true", () => {
  cy.mount(<FormField label="Email" error />);

  cy.get("label").should("have.class", "text-error-600");
});

test("it should render required asterisk when required is true", () => {
  cy.mount(<FormField label="Email" required />);

  cy.get("label").should("contain.text", "*");
  cy.get("label span").should("have.class", "text-error-500");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<FormField description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<FormField errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
});

test("it should apply size typography on corner", () => {
  cy.mount(<FormField corner="Optional" size="lg" />);

  cy.get("span").should("have.class", "text-sm");
});

test("it should merge custom className", () => {
  cy.mount(<FormField className="custom-field" label="Email" />);

  cy.get(".custom-field").should("exist");
});
