// ** Local Imports
import { RichTextEditor } from "@/Components/RichTextEditor";

test("it should render a rich text editor with default props", () => {
  cy.mount(<RichTextEditor aria-label="Description" />);

  cy.get('[role="textbox"]').should("exist");
  cy.get('[role="toolbar"]').should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<RichTextEditor label="Description" aria-label="Description" />);

  cy.contains("Description").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(
    <RichTextEditor aria-label="Description" description="Helper text" />,
  );

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(
    <RichTextEditor error errorMessage="Required" aria-label="Description" />,
  );

  cy.contains("Required").should("be.visible");
  cy.get('[role="textbox"]').should("have.attr", "aria-invalid", "true");
});

test("it should hide toolbar when readOnly", () => {
  cy.mount(<RichTextEditor readOnly aria-label="Description" />);

  cy.get('[role="toolbar"]').should("not.exist");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(
    <RichTextEditor
      id="field-id"
      description="Helper"
      aria-label="Description"
    />,
  );

  cy.get('[role="textbox"]').should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});
