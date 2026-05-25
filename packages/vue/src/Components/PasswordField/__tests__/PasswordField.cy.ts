// ** Local Imports
import { PasswordField } from "@/Components/PasswordField";

test("it should render with default props", () => {
  cy.mount(PasswordField, { attrs: { "aria-label": "Password" } });

  cy.get(".w-full").should("exist");
  cy.get("input").should("exist").and("have.attr", "type", "password");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(PasswordField, { props: { label: "Password" } });

  cy.contains("Password").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(PasswordField, {
    attrs: { "aria-label": "Password" },
    props: { description: "Helper text" },
  });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(PasswordField, {
    attrs: { "aria-label": "Password" },
    props: { error: true, errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(PasswordField, {
    props: { disabled: true },
    attrs: { "aria-label": "Password" },
  });

  cy.get("input").should("be.disabled");
  cy.get("button").should("be.disabled");
});

test("it should toggle password visibility", () => {
  cy.mount(PasswordField, { attrs: { "aria-label": "Password" } });

  cy.get("input").should("have.attr", "type", "password");
  cy.get("button[aria-label='Show password']").click();
  cy.get("input").should("have.attr", "type", "text");
  cy.get("button[aria-label='Hide password']").click();
  cy.get("input").should("have.attr", "type", "password");
});

test("it should not render error icon when error is set", () => {
  cy.mount(PasswordField, {
    props: { error: true },
    attrs: { "aria-label": "Password" },
  });

  cy.get(".lucide-circle-alert").should("not.exist");
});

test("it should forward fallthrough attrs to the input", () => {
  cy.mount(PasswordField, {
    attrs: {
      id: "field-id",
      "aria-label": "Password",
      placeholder: "Enter password",
    },
  });

  cy.get("#field-id")
    .should("exist")
    .and("have.attr", "placeholder", "Enter password");
});

test("it should merge class with root classes", () => {
  cy.mount(PasswordField, {
    props: { class: "custom-field" },
    attrs: { "aria-label": "Password" },
  });

  cy.get(".w-full").should("have.class", "custom-field");
});

test("it should apply custom toggle class", () => {
  cy.mount(PasswordField, {
    attrs: { "aria-label": "Password" },
    props: { classes: { toggle: "custom-toggle" } },
  });

  cy.get("button.custom-toggle").should("exist");
});
