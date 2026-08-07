// ** Local Imports
import { FieldOverlay } from "@/Components/FieldOverlay";

test("it should render menu content when show is true", () => {
  cy.mount(
    <FieldOverlay show overlay="menu">
      <span>Menu body</span>
    </FieldOverlay>,
  );

  cy.contains("Menu body").should("be.visible");
  cy.get('[role="menu"]').should("exist");
});

test("it should render drawer dialog when overlay is drawer", () => {
  cy.mount(
    <FieldOverlay
      show
      overlay="drawer"
      customProps={{ drawer: { transition: "none" } }}
    >
      <span>Drawer body</span>
    </FieldOverlay>,
  );

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Drawer body").should("be.visible");
});

test("it should render modal dialog when overlay is modal", () => {
  cy.mount(
    <FieldOverlay
      show
      overlay="modal"
      customProps={{ modal: { transition: "none" } }}
    >
      <span>Modal body</span>
    </FieldOverlay>,
  );

  cy.get('[role="dialog"]').should("be.visible");
  cy.contains("Modal body").should("be.visible");
});

test("it should not render when show is false", () => {
  cy.mount(
    <FieldOverlay show={false} overlay="menu">
      <span>Hidden</span>
    </FieldOverlay>,
  );

  cy.contains("Hidden").should("not.exist");
});
