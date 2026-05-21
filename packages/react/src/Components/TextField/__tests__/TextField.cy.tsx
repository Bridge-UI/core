// ** External Imports
import { CircleAlert } from "lucide-react";

// ** Local Imports
import { TextField } from "@/Components/TextField";

test("it should render with default props", () => {
  cy.mount(<TextField aria-label="Field" />);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<TextField label="Email" id="email-field" />);

  cy.contains("Email").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<TextField description="Helper text" aria-label="Field" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when error prop is provided", () => {
  cy.mount(<TextField error="Required" aria-label="Field" />);

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<TextField disabled aria-label="Field" />);

  cy.get("input").should("be.disabled");
});

test("it should render start icon when startIcon prop is set", () => {
  cy.mount(<TextField startIcon={CircleAlert} aria-label="Field" />);

  cy.get("svg").should("have.length.at.least", 1);
});

test("it should render start slot content", () => {
  cy.mount(
    <TextField
      aria-label="Field"
      slots={{ start: <span data-cy="start-slot">$</span> }}
    />,
  );

  cy.get("[data-cy=start-slot]").should("be.visible");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(<TextField description="Helper" id="field-id" aria-label="Field" />);

  cy.get("input").should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});

test("it should forward native input attributes", () => {
  cy.mount(
    <TextField id="field-id" placeholder="Enter email" aria-label="Email" />,
  );

  cy.get("#field-id")
    .should("exist")
    .and("have.attr", "placeholder", "Enter email");
});

test("it should merge className with root classes", () => {
  cy.mount(<TextField className="custom-field" aria-label="Field" />);

  cy.get(".w-full").should("have.class", "custom-field");
});
