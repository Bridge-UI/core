// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useFormField, type FormFieldOwnProps } from "@/Components/FormField";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
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
