// ** Local Imports
import { Switcher, useSwitcher } from "@/Components/Switcher";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} as const;

function SwitcherHarness({
  error,
  disabled,
  readonly,
  controlId,
  mainLabel,
  description,
  errorMessage,
}: {
  error?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  mainLabel?: string;
  controlId?: string;
  description?: string;
  errorMessage?: string;
}) {
  const field = useSwitcher(
    {
      error,
      disabled,
      readonly,
      controlId,
      mainLabel,
      description,
      errorMessage,
    },
    libDefaults,
  );

  return (
    <Switcher field={field}>
      <input {...field.controlBind} type="checkbox" aria-label="Control" />
    </Switcher>
  );
}

test("it should render with default props", () => {
  cy.mount(<SwitcherHarness />);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render main label when mainLabel prop is provided", () => {
  cy.mount(
    <SwitcherHarness mainLabel="Email notifications" controlId="notify" />,
  );

  cy.contains("Email notifications").should("be.visible");
  cy.get('label[for="notify"]').should("exist");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<SwitcherHarness description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<SwitcherHarness error errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<SwitcherHarness disabled />);

  cy.get("input").should("be.disabled");
});

test("it should set data-invalid on the root when error is set", () => {
  cy.mount(<SwitcherHarness error />);

  cy.get(".w-full").should("have.attr", "data-invalid", "true");
});
