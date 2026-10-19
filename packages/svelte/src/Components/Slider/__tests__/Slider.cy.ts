// ** Local Imports
import { Slider } from "@/Components/Slider";

test("it should move the thumb with the keyboard", () => {
  cy.mount(Slider, { props: { label: "Volume", defaultValue: 40 } });

  cy.get('[role="slider"]').focus().type("{rightarrow}");
  cy.get('[role="slider"]').should("have.attr", "aria-valuenow", "41");
});

test("it should jump to the pressed track position", () => {
  cy.mount(Slider, { props: { label: "Volume", defaultValue: 0 } });

  cy.get('[role="slider"]')
    .parent()
    .then(($track) => {
      const rect = $track[0].getBoundingClientRect();

      cy.wrap($track).trigger("pointerdown", {
        clientX: rect.left + rect.width * 0.75,
        clientY: rect.top + rect.height / 2,
      });
    });

  cy.document().trigger("pointerup");
  cy.get('[role="slider"]').should("have.attr", "aria-valuenow", "75");
});

test("it should show the value tooltip while focused", () => {
  cy.mount(Slider, { props: { label: "Volume", defaultValue: 60 } });

  cy.get('[role="slider"]').focus();
  cy.get('[role="tooltip"]').should("be.visible").and("contain.text", "60");
});
