// ** External Imports
import { defineComponent, h } from "vue";

// ** Local Imports
import { BaseField, useBaseField } from "@/Components/BaseField";

function mountBaseField(props: Record<string, unknown> = {}) {
  return cy.mount(
    defineComponent({
      inheritAttrs: false,
      setup() {
        const field = useBaseField(() => props);

        return () =>
          h(BaseField, { field }, () =>
            h("input", { type: "text", "aria-label": "Control" }),
          );
      },
    }),
  );
}

test("it should render the control group", () => {
  mountBaseField();

  cy.get('[role="group"]').should("exist");
  cy.get('input[aria-label="Control"]').should("be.visible");
});

test("it should render a label when label prop is provided", () => {
  mountBaseField({ label: "Email address" });

  cy.contains("Email address").should("be.visible");
});

test("it should render description when description prop is provided", () => {
  mountBaseField({ description: "Helper text" });

  cy.contains("Helper text").should("be.visible");
});

test("it should show error message when error is set", () => {
  mountBaseField({
    error: true,
    label: "Email",
    errorMessage: "Required",
  });

  cy.contains("Required").should("be.visible");
});

test("it should render start slot content", () => {
  cy.mount(
    defineComponent({
      inheritAttrs: false,
      setup() {
        const field = useBaseField(() => ({ label: "Code" }));

        return () =>
          h(
            BaseField,
            { field },
            {
              start: () => h("span", { "data-testid": "start-slot" }, "lock"),
              default: () =>
                h("input", { type: "text", "aria-label": "Control" }),
            },
          );
      },
    }),
  );

  cy.get('[data-testid="start-slot"]').should("be.visible");
});
