// ** Local Imports
import { FormControl, useFormControl } from "@/Components/FormControl";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} as const;

function FormControlHarness({
  id,
  error,
  disabled,
  readonly,
  controlId,
  mainLabel,
  description,
  errorMessage,
}: {
  controlId?: string;
  description?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  mainLabel?: string;
  readonly?: boolean;
}) {
  const field = useFormControl(
    {
      id,
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
    <FormControl field={field}>
      <input
        {...field.inputInheritedAttrs}
        {...field.controlBind}
        type="checkbox"
        aria-label="Control"
      />
    </FormControl>
  );
}

test("it should render with default props", () => {
  cy.mount(<FormControlHarness />);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render main label when mainLabel prop is provided", () => {
  cy.mount(
    <FormControlHarness controlId="notify" mainLabel="Email notifications" />,
  );

  cy.contains("Email notifications").should("be.visible");
  cy.get('label[for="notify"]').should("exist");
});

test("it should link label to inherited input id when id is provided", () => {
  cy.mount(
    <FormControlHarness id="notify-id" mainLabel="Email notifications" />,
  );

  cy.get('input[id="notify-id"]').should("exist");
  cy.get('label[for="notify-id"]').should("exist");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<FormControlHarness description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<FormControlHarness error errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<FormControlHarness disabled />);

  cy.get("input").should("be.disabled");
});

test("it should set data-invalid on the root when error is set", () => {
  cy.mount(<FormControlHarness error />);

  cy.get(".w-full").should("have.attr", "data-invalid", "true");
});
