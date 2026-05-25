// ** Local Imports
import { FormField } from "@/Components/FormField";

test("it should render with default props", () => {
  cy.mount(FormField, {
    slots: { default: () => '<input aria-label="Field" />' },
  });

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render label from prop", () => {
  cy.mount(FormField, {
    props: { label: "Email", controlId: "email-field" },
    slots: { default: () => '<input id="email-field" />' },
  });

  cy.contains("Email").should("be.visible");
  cy.get('label[for="email-field"]').should("exist");
});

test("it should apply error color when error is true", () => {
  cy.mount(FormField, {
    props: { label: "Email", error: true },
  });

  cy.get("label").should("have.class", "text-error-600");
});

test("it should render required asterisk when required is true", () => {
  cy.mount(FormField, {
    props: { label: "Email", required: true },
  });

  cy.get("label").should("contain.text", "*");
  cy.get("label span").should("have.class", "text-error-500");
});

test("it should render description when description prop is provided", () => {
  cy.mount(FormField, {
    props: { description: "Helper text" },
  });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(FormField, {
    props: { errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
});

test("it should apply size typography on corner", () => {
  cy.mount(FormField, {
    props: { corner: "Optional", size: "lg" },
  });

  cy.get("span").should("have.class", "text-sm");
});
