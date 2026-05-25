// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render with default props", () => {
  cy.mount(<Textarea aria-label="Field" />);

  cy.get(".w-full").should("exist");
  cy.get("textarea").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<Textarea label="Notes" id="notes-field" />);

  cy.contains("Notes").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<Textarea description="Helper text" aria-label="Field" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<Textarea error errorMessage="Required" aria-label="Field" />);

  cy.contains("Required").should("be.visible");
  cy.get("textarea").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Textarea disabled aria-label="Field" />);

  cy.get("textarea").should("be.disabled");
});

test("it should apply readonly attribute when readonly", () => {
  cy.mount(<Textarea readonly aria-label="Field" />);

  cy.get("textarea").should("have.attr", "readonly");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(<Textarea description="Helper" id="field-id" aria-label="Field" />);

  cy.get("textarea").should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});

test("it should forward native textarea attributes", () => {
  cy.mount(
    <Textarea
      rows={4}
      id="field-id"
      aria-label="Notes"
      placeholder="Enter notes"
    />,
  );

  cy.get("#field-id")
    .should("exist")
    .and("have.attr", "rows", "4")
    .and("have.attr", "placeholder", "Enter notes");
});

test("it should merge className with root classes", () => {
  cy.mount(<Textarea className="custom-field" aria-label="Field" />);

  cy.get(".w-full").should("have.class", "custom-field");
});

test("it should apply resize-none when autosize is enabled", () => {
  cy.mount(<Textarea autosize aria-label="Field" />);

  cy.get("textarea").should("have.class", "resize-none");
});

test("it should render errorMessage slot content", () => {
  cy.mount(
    <Textarea
      error
      aria-label="Field"
      slots={{
        errorMessage: <span data-cy="custom-error">Validation failed</span>,
      }}
    />,
  );

  cy.get("[data-cy=custom-error]").should("be.visible");
});
