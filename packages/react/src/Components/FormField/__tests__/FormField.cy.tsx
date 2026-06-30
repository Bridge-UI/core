// ** Local Imports
import { FormField, useFormField } from "@/Components/FormField";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} as const;

function FieldHarness({
  id,
  error,
  label,
  variant,
  disabled,
  readonly,
  description,
  errorMessage,
}: {
  description?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
  label?: string;
  readonly?: boolean;
  variant?: "filled" | "notched" | "outline" | "stacked" | "underlined";
}) {
  const field = useFormField(
    {
      id,
      error,
      label,
      variant,
      disabled,
      readonly,
      description,
      errorMessage,
    },
    libDefaults,
  );

  return (
    <FormField field={field}>
      <input {...field.inputBind} aria-label="Field" />
    </FormField>
  );
}

test("it should render with default props", () => {
  cy.mount(<FieldHarness />);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<FieldHarness label="Email" id="email-field" />);

  cy.contains("Email").should("be.visible");
  cy.get('label[for="email-field"]').should("exist");
});

test("it should render description when description prop is provided", () => {
  cy.mount(<FieldHarness description="Helper text" />);

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(<FieldHarness error errorMessage="Required" />);

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(<FieldHarness disabled />);

  cy.get("input").should("be.disabled");
});

test("it should apply readonly attribute when readonly", () => {
  cy.mount(<FieldHarness readonly />);

  cy.get("input").should("have.attr", "readonly");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(<FieldHarness id="field-id" description="Helper" />);

  cy.get("input").should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});

test("it should set data-invalid on the root when error is set", () => {
  cy.mount(<FieldHarness error />);

  cy.get(".w-full").should("have.attr", "data-invalid", "true");
});

test("it should render filled variant shell", () => {
  cy.mount(<FieldHarness label="Email" variant="filled" />);

  cy.get(".bg-gray-100").should("exist");
});

test("it should render stacked variant shell", () => {
  cy.mount(<FieldHarness label="Quantity" variant="stacked" />);

  cy.get(".flex.min-h-0.min-w-0.flex-1.flex-col").should("exist");
});
