// ** Local Imports
import { ActionFooter } from "@/Components/ActionFooter";

test("it should render with default props", () => {
  cy.mount(ActionFooter);

  cy.contains("button", "Cancel").should("exist");
  cy.contains("button", "Apply").should("exist");
});

test("it should apply the default Apply color", () => {
  cy.mount(ActionFooter);

  cy.contains("button", "Apply").should("have.class", "bg-primary-500");
});

test("it should render custom labels", () => {
  cy.mount(ActionFooter, {
    props: { applyLabel: "Save", cancelLabel: "Discard" },
  });

  cy.contains("button", "Save").should("exist");
  cy.contains("button", "Discard").should("exist");
});
