// ** External Imports
import { CircleAlert } from "lucide-vue-next";

// ** Local Imports
import { TextField } from "@/Components/TextField";

test("it should render with default props", () => {
  cy.mount(TextField);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(TextField, { props: { label: "Email" } });

  cy.contains("Email").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(TextField, { props: { description: "Helper text" } });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when error prop is provided", () => {
  cy.mount(TextField, { props: { error: "Required" } });

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(TextField, { props: { disabled: true } });

  cy.get("input").should("be.disabled");
});

test("it should render start icon when startIcon prop is set", () => {
  cy.mount(TextField, { props: { startIcon: CircleAlert } });

  cy.get("svg").should("have.length.at.least", 1);
});

test("it should render start slot content", () => {
  cy.mount(TextField, {
    slots: { start: () => "$" },
  });

  cy.contains("$").should("be.visible");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(TextField, {
    attrs: { id: "field-id" },
    props: { description: "Helper" },
  });

  cy.get("input").should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});

test("it should forward fallthrough attrs to the input", () => {
  cy.mount(TextField, {
    attrs: {
      id: "field-from-attrs",
      placeholder: "Enter email",
    },
  });

  cy.get("#field-from-attrs")
    .should("exist")
    .and("have.attr", "placeholder", "Enter email");
});

test("it should merge class with root classes", () => {
  cy.mount(TextField, { props: { class: "custom-field" } });

  cy.get(".w-full").should("have.class", "custom-field");
});
