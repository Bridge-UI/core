// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useFormField, type FormFieldOwnProps } from "@/Components/FormField";

const libDefaults = {
  size: "md",
} satisfies Partial<FormFieldOwnProps>;

function mountUseFormField(
  props: FormFieldOwnProps = {},
  attrs: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useFormField>;

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useFormField(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper, { attrs });

  return result;
}

test("it should default size to md", () => {
  const { merged } = mountUseFormField();

  expect(merged.value.size).toBe("md");
});

test("it should apply size typography on corner bind", () => {
  const { cornerBind } = mountUseFormField({ size: "2xl" });

  expect(cornerBind.value.class).toContain("text-lg");
});

test("it should apply size typography on description bind", () => {
  const { descriptionBind } = mountUseFormField({ size: "xs" });

  expect(descriptionBind.value.class).toContain("text-xs");
});

test("it should hide description in aria-describedby when invalidated", () => {
  const { ariaDescribedBy, controlId } = mountUseFormField({
    error: true,
    description: "Helper",
    errorMessage: "Required",
  });

  expect(ariaDescribedBy.value).toBe(`${controlId.value}-error`);
});

test("it should use controlId when prop is set", () => {
  const { controlId } = mountUseFormField({ controlId: "custom-control" });

  expect(controlId.value).toBe("custom-control");
});
