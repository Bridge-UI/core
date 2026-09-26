// ** Local Imports
import { Rating } from "@/Components/Rating";

test("it should render with an end label", () => {
  cy.mount(<Rating label="Quality" />);

  cy.contains("Quality").should("be.visible");
  cy.get('[role="radio"]').should("have.length", 5);
});

test("it should select a star and clear it on a second click", () => {
  cy.mount(<Rating label="Quality" />);

  cy.get('[role="radio"]')
    .eq(2)
    .click()
    .should("have.attr", "aria-checked", "true")
    .click()
    .should("have.attr", "aria-checked", "false");
});

test("it should render the error message when error is set", () => {
  cy.mount(<Rating error label="Quality" errorMessage="Choose a score." />);

  cy.contains("Choose a score.").should("be.visible");
  cy.get('[role="radiogroup"]').should("have.attr", "aria-invalid", "true");
});

test("it should disable each item when disabled", () => {
  cy.mount(<Rating disabled label="Quality" />);

  cy.get('[role="radio"]').should("be.disabled");
});

test("it should forward name to the hidden input", () => {
  cy.mount(<Rating name="score" label="Quality" defaultValue={3} />);

  cy.get('input[type="hidden"]').should("have.attr", "name", "score");
  cy.get('input[type="hidden"]').should("have.value", "3");
});
