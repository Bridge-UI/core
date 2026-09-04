// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useFormField, type FormFieldOwnProps } from "@/Components/FormField";
import BridgeUIProvider from "@/Provider/BridgeUIProvider.vue";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  showErrorIcon: true,
} satisfies Partial<FormFieldOwnProps>;

function mountUseFormField(
  props: Omit<FormFieldOwnProps, "field"> = {},
  attrs: Record<string, unknown> = {},
  options: Parameters<typeof useFormField>[2] = {},
) {
  let result!: ReturnType<typeof useFormField>;

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useFormField(
        () => ({ ...attrs, ...props }),
        libDefaults,
        options,
      );

      return () => h("div");
    },
  });

  mount(Wrapper, { attrs });

  return result;
}

test("it should merge default color, size, rounded, and variant", () => {
  const { merged } = mountUseFormField();

  expect(merged.value.size).toBe("md");
  expect(merged.value.rounded).toBe("md");
  expect(merged.value.color).toBe("primary");
  expect(merged.value.variant).toBe("outline");
});

test("it should default control to input", () => {
  const { control } = mountUseFormField();

  expect(control.value).toBe("input");
});

test("it should use textarea control when option is set", () => {
  const { control } = mountUseFormField({}, {}, { control: () => "textarea" });

  expect(control.value).toBe("textarea");
});

test("it should apply textarea size classes when control is textarea", () => {
  const { inputBind } = mountUseFormField(
    {},
    {},
    { control: () => "textarea" },
  );

  expect(inputBind.value.class).toContain("py-2");
});

test("it should apply textareaLikeInput padding when likeInput is true", () => {
  const { inputBind } = mountUseFormField(
    {},
    {},
    {
      likeInput: () => true,
      control: () => "textarea",
    },
  );

  expect(inputBind.value.class).toMatch(/py-\[calc/);
});

test("it should be disabled when disabled prop is true", () => {
  const { isDisabled } = mountUseFormField({ disabled: true });

  expect(isDisabled.value).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const { invalidated } = mountUseFormField({ error: true });

  expect(invalidated.value).toBe(true);
});

test("it should set aria-invalid on input when error is true", () => {
  const { inputBind } = mountUseFormField({ error: true });

  expect(inputBind.value["aria-invalid"]).toBe(true);
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { inputBind, controlId } = mountUseFormField({ description: "Helper" });

  expect(inputBind.value["aria-describedby"]).toBe(
    `${controlId.value}-description`,
  );
});

test("it should set aria-describedby to error id when errorMessage is shown", () => {
  const { inputBind, controlId } = mountUseFormField({
    error: true,
    errorMessage: "Required",
  });

  expect(inputBind.value["aria-describedby"]).toBe(`${controlId.value}-error`);
});

test("it should use id from fallthrough attrs for controlId", () => {
  const { controlId, inputBind } = mountUseFormField(
    {},
    { id: "custom-field" },
  );

  expect(controlId.value).toBe("custom-field");
  expect(inputBind.value.id).toBe("custom-field");
});

test("it should apply stacked insets on stackedBody instead of container padding", () => {
  const { containerBind, stackedBodyBind } = mountUseFormField({
    label: "Quantity",
    variant: "stacked",
  });

  expect(containerBind.value.class).not.toMatch(/\bpx-/);
  expect(stackedBodyBind.value.class).toContain("ps-2.5");
  expect(stackedBodyBind.value.class).toContain("pe-2.5");
});

test("it should apply stacked insets on stackedBody when end slot is present", () => {
  let result!: ReturnType<typeof useFormField>;

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      result = useFormField(
        () => ({ label: "Quantity", variant: "stacked" }),
        libDefaults,
      );

      return () => h("div", slots);
    },
  });

  mount(Wrapper, {
    slots: {
      end: () => h("div", { class: "bridge-end-adornment" }),
    },
  });

  expect(result.containerBind.value.class).not.toMatch(/\bpx-/);
  expect(result.stackedBodyBind.value.class).toContain("ps-2.5");
});

test("it should be readonly when readonly prop is true", () => {
  const { inputBind, isReadonly } = mountUseFormField({ readonly: true });

  expect(isReadonly.value).toBe(true);
  expect(inputBind.value.readonly).toBe(true);
});

test("it should not forward modelValue to the input bind", () => {
  const { inputBind } = mountUseFormField({}, { modelValue: 3 });

  expect(inputBind.value.modelValue).toBeUndefined();
});

test("it should expose variantKey for filled variant", () => {
  const { variantKey } = mountUseFormField({ variant: "filled" });

  expect(variantKey.value).toBe("filled");
});

test("it should expose variantKey for notched variant", () => {
  const { variantKey } = mountUseFormField({ variant: "notched" });

  expect(variantKey.value).toBe("notched");
});

test("it should expose variantKey for underlined variant", () => {
  const { variantKey } = mountUseFormField({ variant: "underlined" });

  expect(variantKey.value).toBe("underlined");
});

test("it should set data-bridge-rounded on the container", () => {
  const { containerBind } = mountUseFormField();

  expect(containerBind.value["data-bridge-rounded"]).toBe("md");
  expect(containerBind.value["data-bridge-variant"]).toBe("outline");
});

test("it should keep data-bridge-rounded when variant is underlined", () => {
  const { containerBind } = mountUseFormField({ variant: "underlined" });

  expect(containerBind.value["data-bridge-rounded"]).toBe("md");
  expect(containerBind.value["data-bridge-variant"]).toBe("underlined");
});

test("it should not set aria-describedby when error is true without errorMessage", () => {
  const { inputBind } = mountUseFormField({ error: true });

  expect(inputBind.value["aria-describedby"]).toBeUndefined();
});

test("it should set for on fieldLabelProps to control id", () => {
  const { controlId, fieldLabelProps } = mountUseFormField({
    label: "Email",
    controlId: "email-field",
  });

  expect(fieldLabelProps.value.for).toBe(controlId.value);
});

test("it should set error and required on fieldLabelProps", () => {
  const { fieldLabelProps } = mountUseFormField({
    error: true,
    label: "Email",
    required: true,
  });

  expect(fieldLabelProps.value.error).toBe(true);
  expect(fieldLabelProps.value.required).toBe(true);
});

test("it should merge customProps.label into fieldLabelProps", () => {
  const { fieldLabelProps } = mountUseFormField({
    label: "Email",
    customProps: {
      label: {
        classes: {
          root: "text-orange-600",
        },
      },
    },
  });

  expect(fieldLabelProps.value.classes?.root).toContain("text-orange-600");
});

test("it should set for on fieldCornerProps to control id", () => {
  const { controlId, fieldCornerProps } = mountUseFormField({
    corner: "Optional",
    controlId: "email-field",
  });

  expect(fieldCornerProps.value.for).toBe(controlId.value);
});

test("it should merge customProps.corner into fieldCornerProps", () => {
  const { fieldCornerProps } = mountUseFormField({
    corner: "Optional",
    customProps: {
      corner: {
        classes: {
          root: "text-orange-600",
        },
      },
    },
  });

  expect(fieldCornerProps.value.classes?.root).toContain("text-orange-600");
});

test("it should apply helper inset and tighter type on description bind", () => {
  const { descriptionBind } = mountUseFormField({ description: "Helper" });

  expect(descriptionBind.value.class).toContain("mt-1");
  expect(descriptionBind.value.class).toContain("text-xs");
  expect(descriptionBind.value.class).toContain("ps-2.5");
  expect(descriptionBind.value.class).toContain("pe-2.5");
});

test("it should apply helper inset and tighter type on error bind", () => {
  const { errorBind } = mountUseFormField({
    error: true,
    errorMessage: "Required",
  });

  expect(errorBind.value.class).toContain("mt-1");
  expect(errorBind.value.class).toContain("text-xs");
  expect(errorBind.value.class).toContain("ps-2.5");
  expect(errorBind.value.class).toContain("pe-2.5");
});

test("it should apply FormField registry defaultProps", () => {
  let result!: ReturnType<typeof useFormField>;

  const Consumer = defineComponent({
    setup() {
      result = useFormField({}, libDefaults);

      return () => h("div");
    },
  });

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Consumer),
    },
    props: {
      components: {
        FormField: { defaultProps: { variant: "filled" } },
      },
    },
  });

  expect(result.merged.value.variant).toBe("filled");
});

test("it should let TextField registry override FormField chrome", () => {
  let result!: ReturnType<typeof useFormField>;

  const Consumer = defineComponent({
    setup() {
      result = useFormField({}, libDefaults, { componentName: "TextField" });

      return () => h("div");
    },
  });

  mount(BridgeUIProvider, {
    slots: {
      default: () => h(Consumer),
    },
    props: {
      components: {
        FormField: { defaultProps: { variant: "filled" } },
        TextField: { defaultProps: { variant: "outline" } },
      },
    },
  });

  expect(result.merged.value.variant).toBe("outline");
});
