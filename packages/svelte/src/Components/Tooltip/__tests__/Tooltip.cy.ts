// ** Local Imports
import { Tooltip } from "@/Components/Tooltip";
import { textSnippet } from "@/Utils/__tests__/textSnippet";

test("it should show the tooltip on hover", () => {
  cy.mount(Tooltip, {
    props: { openDelay: 0, content: "Hint", trigger: textSnippet("Hover me") },
  });

  cy.contains("Hover me").trigger("pointerenter");
  cy.get('[role="tooltip"]').should("be.visible").and("contain.text", "Hint");
});

test("it should position the panel above the trigger", () => {
  cy.mount(Tooltip, {
    props: {
      show: true,
      class: "mt-40",
      content: "Hint",
      trigger: textSnippet("Anchor"),
    },
  });

  cy.contains("Anchor").then(($trigger) => {
    const triggerTop = $trigger[0].getBoundingClientRect().top;

    cy.get('[role="tooltip"]').should(($tooltip) => {
      expect($tooltip[0].getBoundingClientRect().bottom).to.be.at.most(
        triggerTop,
      );
    });
  });
});
