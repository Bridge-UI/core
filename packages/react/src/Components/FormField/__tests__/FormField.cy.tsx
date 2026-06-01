// ** Local Imports
import { FormField, useFormField } from "@/Components/FormField";

function FieldHarness({
  error,
  label,
  disabled,
  description,
  errorMessage,
}: {
  label?: string;
  error?: boolean;
  disabled?: boolean;
  description?: string;
  errorMessage?: string;
}) {
  const field = useFormField(
    { label, description, error, errorMessage, disabled },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    },
  );

  return (
    <FormField field={field}>
      <input {...field.inputBind} />
    </FormField>
  );
}

test("it should render with default props", () => {
  cy.mount(<FieldHarness />);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(<FieldHarness label="Email" />);

  cy.contains("Email").should("be.visible");
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
