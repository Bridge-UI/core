// ** Local Imports
import { TextField } from "@/Components/TextField";

test("it should render with default props", () => {
  cy.mount(<TextField />);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<TextField label="Email" />);

  cy.contains("Email").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<TextField description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<TextField error errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<TextField disabled />);

  cy.get("input").should("be.disabled");
});

test("it should forward placeholder to the input", () => {
  cy.mount(<TextField placeholder="Enter email" />);

  cy.get("input").should("have.attr", "placeholder", "Enter email");
});

test("it should merge className with root classes", () => {
  cy.mount(<TextField className="custom-field" />);

  cy.get(".custom-field").should("exist");
});
