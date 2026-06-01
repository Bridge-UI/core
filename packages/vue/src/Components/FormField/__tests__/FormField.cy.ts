// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { FormField, useFormField } from "@/Components/FormField";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} as const;

const FieldHarness = defineComponent({
  props: {
    id: String,
    label: String,
    error: Boolean,
    variant: String,
    disabled: Boolean,
    readonly: Boolean,
    description: String,
    errorMessage: String,
  },
  setup(props) {
    const field = useFormField(() => props, libDefaults);

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
  cy.mount(FieldHarness, {
    props: { label: "Email", id: "email-field" },
  });

  cy.contains("Email").should("be.visible");
  cy.get('label[for="email-field"]').should("exist");
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

test("it should apply readonly attribute when readonly", () => {
  cy.mount(FieldHarness, { props: { readonly: true } });

  cy.get("input").should("have.attr", "readonly");
});

test("it should set aria-describedby when description is shown", () => {
  cy.mount(FieldHarness, {
    attrs: { id: "field-id" },
    props: { description: "Helper" },
  });

  cy.get("input").should(
    "have.attr",
    "aria-describedby",
    "field-id-description",
  );
});

test("it should set data-invalid on the root when error is set", () => {
  cy.mount(FieldHarness, { props: { error: true } });

  cy.get(".w-full").should("have.attr", "data-invalid", "true");
});

test("it should render end slot content", () => {
  cy.mount(FieldHarness, {
    slots: {
      end: () => h("span", { "data-cy": "end-slot" }, "€"),
    },
  });

  cy.get("[data-cy=end-slot]").should("be.visible");
});

test("it should render filled variant shell", () => {
  cy.mount(FieldHarness, {
    props: { variant: "filled", label: "Email" },
  });

  cy.get(".bg-gray-100").should("exist");
});

test("it should render stacked variant shell", () => {
  cy.mount(FieldHarness, {
    props: { variant: "stacked", label: "Quantity" },
  });

  cy.get(".flex.min-h-0.min-w-0.flex-1.flex-col").should("exist");
});
