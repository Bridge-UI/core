// ** Local Imports
import {
  BaseField,
  useBaseField,
  type BaseFieldOwnProps,
} from "@/Components/BaseField";

const libDefaults = {
  size: "md",
  error: false,
  hideErrorMessage: false,
} satisfies Partial<BaseFieldOwnProps>;

function BaseFieldHarness(props: Omit<BaseFieldOwnProps, "field"> = {}) {
  const field = useBaseField(props, libDefaults);

  return (
    <BaseField field={field}>
      <input type="text" aria-label="Control" />
    </BaseField>
  );
}

test("it should render the control inside a group", () => {
  cy.mount(<BaseFieldHarness />);

  cy.get('[role="group"]').should("exist");
  cy.get('input[aria-label="Control"]').should("be.visible");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<BaseFieldHarness label="Email address" />);

  cy.contains("Email address").should("be.visible");
});

test("it should show error message when error is set", () => {
  cy.mount(
    <BaseFieldHarness error label="Email" errorMessage="Invalid email" />,
  );

  cy.contains("Invalid email").should("be.visible");
});

test("it should render start and end slot content", () => {
  cy.mount(
    <BaseFieldHarness
      slots={{
        end: <span data-testid="end-slot">Clear</span>,
        start: <span data-testid="start-slot">Icon</span>,
      }}
    />,
  );

  cy.get('[data-testid="start-slot"]').should("be.visible");
  cy.get('[data-testid="end-slot"]').should("be.visible");
});
