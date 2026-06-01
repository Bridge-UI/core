// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTextField, type TextFieldOwnProps } from "@/Components/TextField";

function mountUseTextField(
  props: TextFieldOwnProps = {},
  attrs: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useTextField>;

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useTextField(props);

      return () => h("div");
    },
  });

  mount(Wrapper, { attrs });

  return result.formField;
}

test("it should merge default color, size, rounded, and variant", () => {
  const formField = mountUseTextField();

  expect(formField.merged.value.size).toBe("md");
  expect(formField.merged.value.rounded).toBe("md");
  expect(formField.merged.value.color).toBe("primary");
  expect(formField.merged.value.variant).toBe("outline");
});

test("it should override color when prop is passed", () => {
  const formField = mountUseTextField({ color: "error" });

  expect(formField.merged.value.color).toBe("error");
});

test("it should be disabled when disabled prop is true", () => {
  const formField = mountUseTextField({ disabled: true });

  expect(formField.isDisabled.value).toBe(true);
});

test("it should be readonly when readonly prop is true", () => {
  const formField = mountUseTextField({ readonly: true });

  expect(formField.isReadonly.value).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const formField = mountUseTextField({ error: true });

  expect(formField.invalidated.value).toBe(true);
});

test("it should not be invalidated when error prop is omitted", () => {
  const formField = mountUseTextField();

  expect(formField.invalidated.value).toBe(false);
});

test("it should not treat error boolean as end suffix text", () => {
  const formField = mountUseTextField({ error: true });

  expect(formField.merged.value.end).toBeUndefined();
});

test("it should set aria-invalid on input when error is true", () => {
  const formField = mountUseTextField({ error: true });

  expect(formField.inputBind.value["aria-invalid"]).toBe(true);
});

test("it should keep error focus ring on container when invalidated", () => {
  const formField = mountUseTextField({ error: true });

  expect(formField.containerBind.value.class).toContain(
    "focus-within:ring-error-600",
  );
  expect(formField.containerBind.value.class).not.toContain(
    "focus-within:ring-primary-600",
  );
});

test("it should set aria-describedby to description id when description is shown", () => {
  const formField = mountUseTextField({ description: "Helper" });

  expect(formField.inputBind.value["aria-describedby"]).toBe(
    `${formField.controlId.value}-description`,
  );
});

test("it should set aria-describedby to error id when errorMessage is shown", () => {
  const formField = mountUseTextField({
    error: true,
    errorMessage: "Required",
  });

  expect(formField.inputBind.value["aria-describedby"]).toBe(
    `${formField.controlId.value}-error`,
  );
});

test("it should use id from fallthrough attrs for controlId", () => {
  const formField = mountUseTextField({}, { id: "custom-field" });

  expect(formField.controlId.value).toBe("custom-field");
  expect(formField.inputBind.value.id).toBe("custom-field");
});

test("it should merge class into rootBind", () => {
  const formField = mountUseTextField({ class: "custom-field" });

  expect(formField.rootBind.value?.class).toContain("w-full");
  expect(formField.rootBind.value?.class).toContain("custom-field");
});

test("it should apply class after classes.root in rootBind", () => {
  const formField = mountUseTextField({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(formField.rootBind.value?.class).toContain("p-4");
  expect(formField.rootBind.value?.class).not.toContain("p-2");
});
