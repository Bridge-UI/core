// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";

test("it should render a file card in the browser", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });

  cy.mount(<FileUpload value={file} />);

  cy.contains("note.txt").should("be.visible");
  cy.get('[aria-label="Remove note.txt"]').should("be.visible");
});

test("it should render a failed upload in the browser", () => {
  cy.mount(
    <FileUpload
      onRetry={() => undefined}
      value={{ state: "error", name: "report.pdf" }}
    />,
  );

  cy.contains("Upload failed. Try again.").should("be.visible");
  cy.get('[aria-label="Retry report.pdf"]').should("be.visible");
});
