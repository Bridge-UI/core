// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render a number input with stepper buttons", () => {
  cy.mount(<NumberField aria-label="Amount" />);

  cy.get('input[type="number"]').should("exist");
  cy.get('button[aria-label="Increment value"]').should("exist");
  cy.get('button[aria-label="Decrement value"]').should("exist");
});

test("it should increment value when increment button is clicked", () => {
  const onChange = cy.stub().as("onChange");

  cy.mount(<NumberField value={1} onChange={onChange} aria-label="Amount" />);

  cy.get('button[aria-label="Increment value"]').click();
  cy.get("@onChange").should("have.been.calledWith", 2);
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<NumberField label="Quantity" aria-label="Quantity" />);

  cy.contains("Quantity").should("be.visible");
});

test("it should disable stepper buttons when disabled", () => {
  cy.mount(<NumberField disabled aria-label="Amount" />);

  cy.get('button[aria-label="Increment value"]').should("be.disabled");
  cy.get('button[aria-label="Decrement value"]').should("be.disabled");
});

test("it should forward min, max, and step attributes", () => {
  cy.mount(
    <NumberField min={0} max={10} step={2} value={4} aria-label="Amount" />,
  );

  cy.get("input")
    .should("have.attr", "min", "0")
    .and("have.attr", "max", "10")
    .and("have.attr", "step", "2")
    .and("have.value", "4");
});

test("it should not render error icon when error is set", () => {
  cy.mount(<NumberField error aria-label="Amount" />);

  cy.get(".lucide-circle-alert").should("not.exist");
});
