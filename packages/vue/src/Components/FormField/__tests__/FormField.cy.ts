// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { FormField, useFormField } from "@/Components/FormField";

const FieldHarness = defineComponent({
  props: {
    label: String,
    error: Boolean,
    disabled: Boolean,
    description: String,
    errorMessage: String,
  },
  setup(props) {
    const field = useFormField(props, {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      withErrorIcon: true,
    });

    return () =>
      h(FormField, { field }, () => h("input", field.inputBind.value));
  },
});

test("it should render with default props", () => {
  cy.mount(FieldHarness);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render a label when label prop is provided", () => {
  cy.mount(FieldHarness, { props: { label: "Email" } });

  cy.contains("Email").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(FieldHarness, { props: { description: "Helper text" } });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(FieldHarness, {
    props: { error: true, errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(FieldHarness, { props: { disabled: true } });

  cy.get("input").should("be.disabled");
});
