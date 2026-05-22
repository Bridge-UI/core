// ** Local Imports
import { Label } from "@/Components/Label";

test("it should render with default props", () => {
  cy.mount(Label, { slots: { default: () => "Email" } });

  cy.get("label").should("exist").and("contain.text", "Email");
});

test("it should associate with a field via for", () => {
  cy.mount(Label, {
    props: { for: "field-id" },
    slots: { default: () => "Email" },
  });

  cy.get("label").should("have.attr", "for", "field-id");
});

test("it should apply error color when error is true", () => {
  cy.mount(Label, {
    props: { error: true },
    slots: { default: () => "Email" },
  });

  cy.get("label").should("have.class", "text-error-600");
});

test("it should render required asterisk when required is true", () => {
  cy.mount(Label, {
    props: { required: true },
    slots: { default: () => "Email" },
  });

  cy.get("label").should("contain.text", "*");
  cy.get("label span").should("have.class", "text-error-500");
});

test("it should apply size typography class", () => {
  cy.mount(Label, {
    props: { size: "lg" },
    slots: { default: () => "Email" },
  });

  cy.get("label").should("have.class", "text-sm");
});

test("it should merge custom class", () => {
  cy.mount(Label, {
    props: { class: "custom-label" },
    slots: { default: () => "Email" },
  });

  cy.get("label").should("have.class", "custom-label");
});
