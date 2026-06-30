// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render a textarea with default props", () => {
  cy.mount(<Textarea aria-label="Notes" />);

  cy.get(".w-full").should("exist");
  cy.get("textarea").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<Textarea label="Notes" aria-label="Notes" />);

  cy.contains("Notes").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<Textarea aria-label="Notes" description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<Textarea error aria-label="Notes" errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get("textarea").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Textarea disabled aria-label="Notes" />);

  cy.get("textarea").should("be.disabled");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(<Textarea id="field-id" aria-label="Notes" description="Helper" />);

  cy.get("textarea").should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});

test("it should apply vertical resize when resize is vertical", () => {
  cy.mount(<Textarea resize="vertical" aria-label="Notes" />);

  cy.get("textarea").should("have.class", "resize-y");
});

test("it should forward placeholder to the textarea", () => {
  cy.mount(<Textarea aria-label="Notes" placeholder="Write here" />);

  cy.get("textarea").should("have.attr", "placeholder", "Write here");
});
