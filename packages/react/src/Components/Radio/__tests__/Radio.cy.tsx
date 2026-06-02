// ** Local Imports
import { Radio } from "@/Components/Radio";

test("it should render with main label", () => {
  cy.mount(<Radio value="a" mainLabel="Option A" />);

  cy.contains("Option A").should("be.visible");
  cy.get('input[type="radio"]').should("exist");
});

test("it should toggle when clicked in uncontrolled mode", () => {
  cy.mount(<Radio value="a" mainLabel="Option A" defaultChecked={false} />);

  cy.get('input[type="radio"]')
    .should("not.be.checked")
    .click({ force: true })
    .should("be.checked");
});

test("it should be checked when checked prop is true", () => {
  cy.mount(<Radio value="a" checked mainLabel="Option A" />);

  cy.get('input[type="radio"]').should("be.checked");
});

test("it should render error message when error is set", () => {
  cy.mount(
    <Radio value="a" mainLabel="Option A" error errorMessage="Required" />,
  );

  cy.contains("Required").should("be.visible");
  cy.get('input[type="radio"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Radio value="a" mainLabel="Option A" disabled />);

  cy.get('input[type="radio"]').should("be.disabled");
});

test("it should forward name to the native input", () => {
  cy.mount(<Radio value="a" name="plan" mainLabel="Option A" />);

  cy.get('input[type="radio"]').should("have.attr", "name", "plan");
});
