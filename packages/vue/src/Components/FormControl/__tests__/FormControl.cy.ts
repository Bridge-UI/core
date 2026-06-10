// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { FormControl, useFormControl } from "@/Components/FormControl";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} as const;

const FormControlHarness = defineComponent({
  inheritAttrs: false,
  props: {
    error: Boolean,
    endLabel: String,
    disabled: Boolean,
    readonly: Boolean,
    controlId: String,
    mainLabel: String,
    startLabel: String,
    description: String,
    errorMessage: String,
  },
  setup(props, { attrs }) {
    const field = useFormControl(() => ({ ...attrs, ...props }), libDefaults);

    return () =>
      h(FormControl, { field }, () =>
        h("input", {
          ...field.controlBind.value,
          type: "checkbox",
          "aria-label": "Control",
        }),
      );
  },
});

test("it should render with default props", () => {
  cy.mount(FormControlHarness);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render main label when mainLabel prop is provided", () => {
  cy.mount(FormControlHarness, {
    attrs: { controlId: "notify" },
    props: { controlId: "notify", mainLabel: "Email notifications" },
  });

  cy.get('label[for="notify"]').should("exist");
  cy.contains("Email notifications").should("be.visible");
});

test("it should link label to inherited input id when id is provided", () => {
  cy.mount(FormControlHarness, {
    attrs: { id: "notify-id" },
    props: { mainLabel: "Email notifications" },
  });

  cy.get('input[id="notify-id"]').should("exist");
  cy.get('label[for="notify-id"]').should("exist");
});

test("it should render description when description prop is provided", () => {
  cy.mount(FormControlHarness, { props: { description: "Helper text" } });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(FormControlHarness, {
    props: { error: true, errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(FormControlHarness, { props: { disabled: true } });

  cy.get("input").should("be.disabled");
});

test("it should set data-invalid on the root when error is set", () => {
  cy.mount(FormControlHarness, { props: { error: true } });

  cy.get(".w-full").should("have.attr", "data-invalid", "true");
});
