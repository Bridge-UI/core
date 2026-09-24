// ** Local Imports
import { RichTextEditor } from "@/Components/RichTextEditor";

test("it should render a rich text editor with default props", () => {
  cy.mount(RichTextEditor);

  cy.get('[role="textbox"]').should("exist");
  cy.get('[role="toolbar"]').should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(RichTextEditor, { props: { label: "Description" } });

  cy.contains("Description").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(RichTextEditor, { props: { description: "Helper text" } });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(RichTextEditor, {
    props: { error: true, errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
  cy.get('[role="textbox"]').should("have.attr", "aria-invalid", "true");
});

test("it should hide toolbar when readOnly", () => {
  cy.mount(RichTextEditor, { props: { readOnly: true } });

  cy.get('[role="toolbar"]').should("not.exist");
});
