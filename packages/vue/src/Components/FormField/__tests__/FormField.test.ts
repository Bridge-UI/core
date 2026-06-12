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

function mountTextareaFormField(
  props: Omit<FormFieldOwnProps, "field"> = {},
  attrs: Record<string, unknown> = {},
) {
  return mount(
    defineComponent({
      inheritAttrs: false,
      setup() {
        const field = useFormField(
          () => ({ ...attrs, ...props }),
          libDefaults,
          { control: () => "textarea" },
        );

        return () =>
          h(FormField, { field }, () => h("textarea", field.inputBind.value));
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
  const wrapper = mountFormField({ label: "Email" }, { id: "email-field" });

  expect(wrapper.text()).toContain("Email");
  expect(wrapper.find('label[for="email-field"]').exists()).toBe(true);
});

test("it should render corner text when corner prop is provided", () => {
  const wrapper = mountFormField({ corner: "Optional" });

  expect(wrapper.text()).toContain("Optional");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mountFormField({ description: "Helper text" });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should hide description when field is invalid", () => {
  const wrapper = mountFormField({
    error: true,
    description: "Helper text",
  });

  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mountFormField({
    error: true,
    errorMessage: "Required",
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should hide error message content when only error is true", () => {
  const wrapper = mountFormField({ error: true });

  const errorRegion = wrapper.find('[id$="-error"]');

  expect(errorRegion.text()).toBe("");
  expect(errorRegion.exists()).toBe(true);
  expect(errorRegion.attributes("aria-hidden")).toBe("true");
});

test("it should apply disabled attribute on the input when disabled", () => {
  const wrapper = mountFormField({ disabled: true });

  expect(wrapper.find("input").attributes("disabled")).toBeDefined();
});

test("it should apply readonly attribute on the input when readonly", () => {
  const wrapper = mountFormField({ readonly: true });

  expect(wrapper.find("input").attributes("readonly")).toBeDefined();
});

test("it should set aria-invalid on the input when error is set", () => {
  const wrapper = mountFormField({ error: true });

  expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  const wrapper = mountFormField({ description: "Helper" }, { id: "field-id" });

  const input = wrapper.find("input");

  expect(wrapper.find("#field-id-description").exists()).toBe(true);
  expect(input.attributes("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  const wrapper = mountFormField(
    { error: true, errorMessage: "Required" },
    { id: "field-id" },
  );

  const input = wrapper.find("input");

  expect(wrapper.find("#field-id-error").exists()).toBe(true);
  expect(input.attributes("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const wrapper = mountFormField({ error: true });

  expect(wrapper.find(".w-full").attributes("data-invalid")).toBe("true");
});

test("it should render start text when start prop is set", () => {
  const wrapper = mountFormField({
    label: "Website",
    start: "https://",
  });

  expect(wrapper.text()).toContain("https://");
});

test("it should render start icon when startIcon prop is set", () => {
  const wrapper = mountFormField({ startIcon: CircleAlert });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should render end icon when endIcon prop is set", () => {
  const wrapper = mountFormField({ endIcon: CircleAlert });

  expect(wrapper.findAll("svg").length).toBeGreaterThan(0);
});

test("it should render error icon when error is set", () => {
  const wrapper = mountFormField({ error: true });

  expect(wrapper.findAll("svg").length).toBe(1);
});

test("it should render error icon instead of end icon when error is set", () => {
  const wrapper = mountFormField({
    error: true,
    endIcon: CircleAlert,
  });

  expect(wrapper.findAll("svg").length).toBe(1);
});

test("it should hide error icon when withErrorIcon is false", () => {
  const wrapper = mountFormField({
    error: true,
    withErrorIcon: false,
  });

  expect(wrapper.findAll("svg").length).toBe(0);
});

test("it should render required asterisk when required is true", () => {
  const wrapper = mountFormField({
    label: "Email",
    required: true,
  });

  expect(wrapper.text()).toContain("*");
});

test("it should apply error color on the label when error is set", () => {
  const wrapper = mountFormField({
    error: true,
    label: "Email",
  });

  expect(wrapper.find('[class*="text-error-600"]').exists()).toBe(true);
});

test("it should render start slot content", () => {
  const wrapper = mount(
    defineComponent({
      setup() {
        const field = useFormField({}, libDefaults);

        return () =>
          h(FormField, { field }, () => h("input", field.inputBind.value));
      },
    }),
    {
      slots: {
        start: () => h("span", { "data-testid": "start-slot" }, "$"),
      },
    },
  );

  expect(wrapper.find('[data-testid="start-slot"]').exists()).toBe(true);
});

test("it should render end slot content", () => {
  const wrapper = mount(
    defineComponent({
      setup() {
        const field = useFormField({}, libDefaults);

        return () =>
          h(FormField, { field }, () => h("input", field.inputBind.value));
      },
    }),
    {
      slots: {
        end: () => h("span", { "data-testid": "end-slot" }, "€"),
      },
    },
  );

  expect(wrapper.find('[data-testid="end-slot"]').exists()).toBe(true);
});

test("it should merge class with root classes", () => {
  const wrapper = mountFormField({ class: "custom-field" });

  expect(wrapper.find(".w-full").classes()).toContain("custom-field");
});

test("it should forward fallthrough attrs to the input", () => {
  const wrapper = mountFormField(
    {},
    {
      id: "field-from-attrs",
      placeholder: "Enter email",
    },
  );

  const input = wrapper.find("#field-from-attrs");

  expect(input.exists()).toBe(true);
  expect(input.attributes("placeholder")).toBe("Enter email");
});

test("it should forward customProps to the input", () => {
  const wrapper = mountFormField({
    customProps: {
      input: { "data-testid": "form-field-input" },
    },
  });

  expect(wrapper.find('[data-testid="form-field-input"]').exists()).toBe(true);
});

test("it should forward customProps to description", () => {
  const wrapper = mountFormField({
    description: "Helper",
    customProps: {
      description: { "data-testid": "field-description" },
    },
  });

  expect(wrapper.find('[data-testid="field-description"]').exists()).toBe(true);
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mountFormField({
    class: "p-4",
    classes: { root: "p-2" },
  });

  const root = wrapper.find(".w-full");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});

test("it should forward classes and customProps to chrome", () => {
  const wrapper = mountFormField({
    label: "Email",
    corner: "Optional",
    classes: {
      label: "custom-label-class",
      corner: "custom-corner-class",
    },
    customProps: {
      label: { "data-testid": "field-label" },
      corner: { "data-testid": "field-corner" },
    },
  });

  expect(wrapper.find('[data-testid="field-label"]').classes()).toContain(
    "custom-label-class",
  );
  expect(wrapper.find('[data-testid="field-corner"]').classes()).toContain(
    "custom-corner-class",
  );
});

test("it should merge classes.input onto the control", () => {
  const wrapper = mountFormField({
    placeholder: "Type here",
    classes: { input: "placeholder:italic" },
  });

  expect(wrapper.find("input").classes()).toContain("placeholder:italic");
});

test("it should render errorMessage slot as the error region", () => {
  const wrapper = mount(
    defineComponent({
      setup() {
        const field = useFormField({ error: true }, libDefaults);

        return () =>
          h(FormField, { field }, () => h("input", field.inputBind.value));
      },
    }),
    {
      slots: {
        errorMessage: () =>
          h("span", { "data-testid": "custom-error" }, "Validation failed"),
      },
    },
  );

  expect(wrapper.find('[data-testid="custom-error"]').exists()).toBe(true);
});

test("it should update chrome when label and error props change", async () => {
  const wrapper = mount(
    defineComponent({
      setup(props) {
        const field = useFormField(() => props, libDefaults);

        return () =>
          h(FormField, { field }, () => h("input", field.inputBind.value));
      },
      props: {
        label: { type: String, required: true },
        error: { type: Boolean, default: false },
        description: { type: String, default: undefined },
        errorMessage: { type: String, default: undefined },
      },
    }),
    {
      props: {
        label: "First",
        description: "Helper",
      },
    },
  );

  expect(wrapper.text()).toContain("First");
  expect(wrapper.text()).toContain("Helper");

  await wrapper.setProps({
    error: true,
    label: "Second",
    description: undefined,
    errorMessage: "Required",
  });

  expect(wrapper.text()).toContain("Second");
  expect(wrapper.text()).toContain("Required");
  expect(wrapper.text()).not.toContain("First");
  expect(wrapper.text()).not.toContain("Helper");
});

test("it should render filled variant container styles", () => {
  const wrapper = mountFormField({
    label: "Email",
    variant: "filled",
  });

  expect(wrapper.find(".bg-gray-100").exists()).toBe(true);
});

test("it should render notched variant with floating label row", () => {
  const wrapper = mountFormField({
    label: "Email",
    variant: "notched",
  });

  expect(wrapper.find(".-translate-y-1\\/2").exists()).toBe(true);
});

test("it should render stacked variant with stacked body layout", () => {
  const wrapper = mountFormField({
    label: "Quantity",
    variant: "stacked",
  });

  expect(wrapper.find(".flex.min-h-0.min-w-0.flex-1.flex-col").exists()).toBe(
    true,
  );
});

test("it should render underlined variant with bottom border", () => {
  const wrapper = mountFormField({ variant: "underlined" });

  expect(wrapper.find(".border-b-2").exists()).toBe(true);
});

test("it should render textarea control with textarea sizing", () => {
  const wrapper = mountTextareaFormField();

  expect(wrapper.find("textarea").exists()).toBe(true);
  expect(wrapper.find("textarea").classes().join(" ")).toContain("py-2");
});

test("it should apply error styles on the container when error is set", () => {
  const wrapper = mountFormField({ error: true });

  expect(wrapper.find(".group\\/field").classes()).toContain("ring-error-500");
});
