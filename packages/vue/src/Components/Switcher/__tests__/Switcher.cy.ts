// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { Switcher, useSwitcher } from "@/Components/Switcher";

const libDefaults = {
  size: "md",
  error: false,
  withoutErrorMessage: false,
} as const;

const SwitcherHarness = defineComponent({
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
    const field = useSwitcher(() => ({ ...attrs, ...props }), libDefaults);

    return () =>
      h(Switcher, { field }, () =>
        h("input", {
          ...field.controlBind.value,
          type: "checkbox",
          "aria-label": "Control",
        }),
      );
  },
});

test("it should render with default props", () => {
  cy.mount(SwitcherHarness);

  cy.get("input").should("exist");
  cy.get(".w-full").should("exist");
});

test("it should render main label when mainLabel prop is provided", () => {
  cy.mount(SwitcherHarness, {
    attrs: { controlId: "notify" },
    props: { mainLabel: "Email notifications", controlId: "notify" },
  });

  cy.get('label[for="notify"]').should("exist");
  cy.contains("Email notifications").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  cy.mount(SwitcherHarness, { props: { description: "Helper text" } });

  cy.contains("Helper text").should("be.visible");
});

test("it should render error message when errorMessage prop is provided", () => {
  cy.mount(SwitcherHarness, {
    props: { error: true, errorMessage: "Required" },
  });

  cy.contains("Required").should("be.visible");
  cy.get("input").should("have.attr", "aria-invalid", "true");
});

test("it should apply disabled attribute when disabled", () => {
  cy.mount(SwitcherHarness, { props: { disabled: true } });

  cy.get("input").should("be.disabled");
});

test("it should set data-invalid on the root when error is set", () => {
  cy.mount(SwitcherHarness, { props: { error: true } });

  cy.get(".w-full").should("have.attr", "data-invalid", "true");
});
