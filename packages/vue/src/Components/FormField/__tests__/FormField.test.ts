// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { FormField, useFormField } from "@/Components/FormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} satisfies Partial<FormFieldOwnProps>;

function mountFormField(
  props: Omit<FormFieldOwnProps, "field"> = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      inheritAttrs: false,
      setup() {
        const field = useFormField(() => ({ ...attrs, ...props }), libDefaults);

        return () =>
          h(FormField, { field }, () => h("input", field.inputBind.value));
      },
    }),
    { attrs },
  );
}

test("it should render the control element", () => {
  const wrapper = mountFormField();

  expect(wrapper.find("input").exists()).toBe(true);
  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mountFormField({ label: "Email" });

  expect(wrapper.text()).toContain("Email");
  expect(wrapper.find("label[for]").exists()).toBe(true);
});

test("it should render description when description prop is provided", () => {
  const wrapper = mountFormField({ description: "Helper text" });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mountFormField({
    error: true,
    errorMessage: "Required",
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should apply disabled attribute on the input when disabled", () => {
  const wrapper = mountFormField({ disabled: true });

  expect(wrapper.find("input").attributes("disabled")).toBeDefined();
});

test("it should set aria-invalid on the input when error is set", () => {
  const wrapper = mountFormField({ error: true });

  expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
});

test("it should set data-invalid on the root when error is set", () => {
  const wrapper = mountFormField({ error: true });

  expect(wrapper.find(".w-full").attributes("data-invalid")).toBe("true");
});

test("it should render start icon when startIcon prop is set", () => {
  const wrapper = mountFormField({ startIcon: CircleAlert });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should render end slot content", () => {
  const wrapper = mount(
    defineComponent({
      setup() {
        const field = useFormField({ label: "Amount" }, libDefaults);

        return () =>
          h(
            FormField,
            { field },
            {
              default: () => h("input", field.inputBind.value),
            },
          );
      },
    }),
    {
      slots: {
        end: () => h("span", "€"),
      },
    },
  );

  expect(wrapper.text()).toContain("€");
});
