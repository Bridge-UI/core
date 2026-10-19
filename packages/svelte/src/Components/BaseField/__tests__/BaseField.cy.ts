// ** Local Imports
import BaseFieldHost from "@/Components/BaseField/__tests__/BaseFieldHost.svelte";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

test("it should render the field chrome around the control", () => {
  cy.mount(BaseFieldHost, {
    props: {
      label: "Volume",
      description: "Pick a level",
      children: textSnippet("control"),
    },
  });

  cy.get("label").should("contain.text", "Volume");
  cy.get('[role="group"]').should("contain.text", "control");
  cy.contains("Pick a level").should("be.visible");
});

test("it should show the error message when invalid", () => {
  cy.mount(BaseFieldHost, {
    props: { error: true, errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
});
