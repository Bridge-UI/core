// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import { useTextField, type TextFieldOwnProps } from "@/Components/TextField";

const libDefaults: Partial<TextFieldOwnProps> = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
};

function mountUseTextField(
  props: TextFieldOwnProps = {},
  attrs: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useTextField>;

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useTextField(props, libDefaults);

      return () => h("div");
    },
  });

  mount(Wrapper, { attrs });

  return result;
}

test("it should merge default color, size, rounded, and variant", () => {
  const { merged } = mountUseTextField();

  expect(merged.value.size).toBe("md");
  expect(merged.value.rounded).toBe("md");
  expect(merged.value.color).toBe("primary");
  expect(merged.value.variant).toBe("outline");
});

test("it should use md size and rounded when hook is called without libDefaults", () => {
  let result!: ReturnType<typeof useTextField>;

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useTextField({});

      return () => h("div");
    },
  });

  mount(Wrapper);

  expect(result.merged.value.size).toBe("md");
  expect(result.merged.value.rounded).toBe("md");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseTextField({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should be disabled when disabled prop is true", () => {
  const { isDisabled } = mountUseTextField({ disabled: true });

  expect(isDisabled.value).toBe(true);
});

test("it should be readonly when readonly prop is true", () => {
  const { isReadonly } = mountUseTextField({ readonly: true });

  expect(isReadonly.value).toBe(true);
});

test("it should be invalidated when error prop is set", () => {
  const { invalidated } = mountUseTextField({ error: "Required" });

  expect(invalidated.value).toBe(true);
});

test("it should show header when label prop is provided", () => {
  const { showHeader } = mountUseTextField({ label: "Email" });

  expect(showHeader.value).toBe(true);
});

test("it should show header when only corner prop is provided", () => {
  const { showHeader } = mountUseTextField({ corner: "Optional" });

  expect(showHeader.value).toBe(true);
});

test("it should show description when description is set and field is valid", () => {
  const { showDescription } = mountUseTextField({ description: "Helper text" });

  expect(showDescription.value).toBe(true);
});

test("it should hide description when field is invalid", () => {
  const { showDescription } = mountUseTextField({
    error: "Required",
    description: "Helper text",
  });

  expect(showDescription.value).toBe(false);
});

test("it should show error message when error is set", () => {
  const { showError } = mountUseTextField({ error: "Required" });

  expect(showError.value).toBe(true);
});

test("it should hide error message when errorless is true", () => {
  const { showError } = mountUseTextField({
    errorless: true,
    error: "Required",
  });

  expect(showError.value).toBe(false);
});

test("it should show start text when start prop is set", () => {
  const { showStartText, showStartIcon } = mountUseTextField({
    start: "https://",
  });

  expect(showStartText.value).toBe(true);
  expect(showStartIcon.value).toBe(false);
});

test("it should show start icon when startIcon is set", () => {
  const { showStartIcon } = mountUseTextField({ startIcon: CircleAlert });

  expect(showStartIcon.value).toBe(true);
});

test("it should show error icon when invalid and no end icon", () => {
  const { showErrorIcon } = mountUseTextField({ error: "Required" });

  expect(showErrorIcon.value).toBe(true);
});

test("it should hide error icon when errorless is true", () => {
  const { showErrorIcon } = mountUseTextField({
    errorless: true,
    error: "Required",
  });

  expect(showErrorIcon.value).toBe(false);
});

test("it should hide error icon when withErrorIcon is false", () => {
  const { showErrorIcon } = mountUseTextField({
    error: "Required",
    withErrorIcon: false,
  });

  expect(showErrorIcon.value).toBe(false);
});

test("it should set aria-invalid on input when error is set", () => {
  const { inputBind } = mountUseTextField({ error: "Required" });

  expect(inputBind.value["aria-invalid"]).toBe(true);
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { inputBind, inputId } = mountUseTextField({ description: "Helper" });

  expect(inputBind.value["aria-describedby"]).toBe(
    `${inputId.value}-description`,
  );
});

test("it should set aria-describedby to error id when error is shown", () => {
  const { inputBind, inputId } = mountUseTextField({ error: "Required" });

  expect(inputBind.value["aria-describedby"]).toBe(`${inputId.value}-error`);
});

test("it should use id from fallthrough attrs for inputId", () => {
  const { inputId, inputBind } = mountUseTextField({}, { id: "custom-field" });

  expect(inputId.value).toBe("custom-field");
  expect(inputBind.value.id).toBe("custom-field");
});

test("it should merge class into rootBind", () => {
  const { rootBind } = mountUseTextField({ class: "custom-field" });

  expect(rootBind.value.class).toContain("w-full");
  expect(rootBind.value.class).toContain("custom-field");
});

test("it should apply class after classes.root in rootBind", () => {
  const { rootBind } = mountUseTextField({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value.class).toContain("p-4");
  expect(rootBind.value.class).not.toContain("p-2");
});
