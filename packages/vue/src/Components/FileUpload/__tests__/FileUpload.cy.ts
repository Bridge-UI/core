// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";

test("it should render with default props", () => {
  cy.mount(FileUpload);

  cy.contains("Choose file").should("be.visible");
});

test("it should render a dropzone when variant is dropzone", () => {
  cy.mount(FileUpload, {
    props: {
      variant: "dropzone",
      title: "Drop images here",
      description: "or click to browse",
    },
  });

  cy.contains("Drop images here").should("be.visible");
  cy.contains("or click to browse").should("be.visible");
});

test("it should render a label when provided", () => {
  cy.mount(FileUpload, {
    props: { label: "Attachments" },
  });

  cy.contains("Attachments").should("be.visible");
});

test("it should render a single file as an attachment card", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });

  cy.mount(FileUpload, {
    props: { modelValue: [file] },
  });

  cy.contains("note.txt").should("be.visible");
  cy.contains("TXT").should("be.visible");
  cy.contains("Choose file").should("not.exist");
});

test("it should render a custom button label", () => {
  cy.mount(FileUpload, {
    props: { buttonLabel: "Browse" },
  });

  cy.contains("Browse").should("be.visible");
});
