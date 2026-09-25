// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";

test("it should render with default props", () => {
  cy.mount(<FileUpload />);

  cy.contains("Choose file").should("be.visible");
});

test("it should render a dropzone when variant is dropzone", () => {
  cy.mount(
    <FileUpload
      variant="dropzone"
      title="Drop images here"
      description="or click to browse"
    />,
  );

  cy.contains("Drop images here").should("be.visible");
  cy.contains("or click to browse").should("be.visible");
});

test("it should render a label when provided", () => {
  cy.mount(<FileUpload label="Attachments" />);

  cy.contains("Attachments").should("be.visible");
});

test("it should render a single file as an attachment card", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });

  cy.mount(<FileUpload value={file} />);

  cy.contains("note.txt").should("be.visible");
  cy.contains("TXT").should("be.visible");
  cy.contains("Choose file").should("not.exist");
});

test("it should render a remote attachment card", () => {
  cy.mount(<FileUpload value={{ size: 45 * 1024, name: "Diploma.pdf" }} />);

  cy.contains("PDF").should("be.visible");
  cy.contains("Diploma.pdf").should("be.visible");
});

test("it should render a custom button label", () => {
  cy.mount(<FileUpload buttonLabel="Browse" />);

  cy.contains("Browse").should("be.visible");
});
