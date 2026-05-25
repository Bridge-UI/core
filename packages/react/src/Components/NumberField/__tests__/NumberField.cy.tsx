// ** Local Imports
import { NumberField } from "@/Components/NumberField";

test("it should render with default props", () => {
  cy.mount(<NumberField aria-label="Amount" />);

  cy.get(".w-full").should("exist");
  cy.get("input").should("exist").and("have.attr", "type", "number");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<NumberField label="Quantity" id="quantity-field" />);

  cy.contains("Quantity").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<NumberField description="Helper text" aria-label="Amount" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<NumberField error errorMessage="Required" aria-label="Amount" />);

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<NumberField disabled aria-label="Amount" />);

  cy.get("input").should("be.disabled");
  cy.get("button[aria-label='Increment value']").should("be.disabled");
  cy.get("button[aria-label='Decrement value']").should("be.disabled");
});

test("it should render increment and decrement buttons", () => {
  cy.mount(<NumberField aria-label="Amount" />);

  cy.get("button[aria-label='Increment value']").should("exist");
  cy.get("button[aria-label='Decrement value']").should("exist");
});

test("it should call onChange when increment is clicked", () => {
  const onChange = cy.stub().as("onChange");

  cy.mount(<NumberField value={1} onChange={onChange} aria-label="Amount" />);

  cy.get("button[aria-label='Increment value']").click();
  cy.get("@onChange").should("have.been.calledWith", 2);
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

test("it should forward native input attributes", () => {
  cy.mount(<NumberField id="field-id" placeholder="0" aria-label="Amount" />);

  cy.get("#field-id").should("exist").and("have.attr", "placeholder", "0");
});

test("it should merge className with root classes", () => {
  cy.mount(<NumberField className="custom-field" aria-label="Amount" />);

  cy.get(".w-full").should("have.class", "custom-field");
});

test("it should apply custom increment and decrement classes", () => {
  cy.mount(
    <NumberField
      aria-label="Amount"
      classes={{ increment: "custom-increment", decrement: "custom-decrement" }}
    />,
  );

  cy.get("button.custom-increment").should("exist");
  cy.get("button.custom-decrement").should("exist");
});
