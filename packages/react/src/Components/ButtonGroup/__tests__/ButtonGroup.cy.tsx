// ** Local Imports
import { Button } from "@/Components/Button";
import { ButtonGroup } from "@/Components/ButtonGroup";

test("it should render a button group in the browser", () => {
  cy.mount(
    <ButtonGroup aria-label="Export">
      <Button variant="outline">Copy</Button>
      <Button variant="outline">Paste</Button>
    </ButtonGroup>,
  );

  cy.get('[role="group"]')
    .should("exist")
    .and("have.attr", "aria-label", "Export")
    .and("have.class", "flex-row");

  cy.contains("button", "Copy").should("be.visible");
  cy.contains("button", "Paste").should("be.visible");
});

test("it should apply vertical orientation", () => {
  cy.mount(
    <ButtonGroup aria-label="Zoom" orientation="vertical">
      <Button>+</Button>
      <Button>-</Button>
    </ButtonGroup>,
  );

  cy.get('[role="group"]').should("have.class", "flex-col");
});

test("it should render nested button groups", () => {
  cy.mount(
    <ButtonGroup aria-label="Editor">
      <ButtonGroup>
        <Button variant="outline">Bold</Button>
        <Button variant="outline">Italic</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Undo</Button>
        <Button variant="outline">Redo</Button>
      </ButtonGroup>
    </ButtonGroup>,
  );

  cy.get('[role="group"]').should("have.length", 3);
  cy.contains("button", "Bold").should("be.visible");
  cy.contains("button", "Undo").should("be.visible");
});
