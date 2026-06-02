// ** Local Imports
import { Checkbox } from "@/Components/Checkbox";

test("it should render with main label", () => {
  cy.mount(<Checkbox mainLabel="Accept terms" />);

  cy.contains("Accept terms").should("be.visible");
  cy.get('input[type="checkbox"]').should("exist");
});

test("it should toggle when clicked in uncontrolled mode", () => {
  cy.mount(<Checkbox mainLabel="Accept terms" defaultChecked={false} />);

  cy.get('input[type="checkbox"]')
    .should("not.be.checked")
    .click({ force: true })
    .should("be.checked");
});

test("it should render description when description prop is provided", () => {
  cy.mount(
    <Checkbox mainLabel="Accept" description="You must accept to continue" />,
  );

  cy.contains("You must accept to continue").should("be.visible");
});

test("it should render error message when error is set", () => {
  cy.mount(<Checkbox mainLabel="Accept" error errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get('input[type="checkbox"]').should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<Checkbox mainLabel="Accept" disabled />);

  cy.get('input[type="checkbox"]').should("be.disabled");
});

test("it should reflect checked state when controlled", () => {
  cy.mount(<Checkbox mainLabel="Accept" checked />);

  cy.get('input[type="checkbox"]').should("be.checked");
});
