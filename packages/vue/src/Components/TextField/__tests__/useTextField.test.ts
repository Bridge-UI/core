// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";
import { defineComponent, h } from "vue";

// ** Local Imports
import {
  TextField,
  useTextField,
  type TextFieldOwnProps,
} from "@/Components/TextField";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
  withErrorIcon: true,
} satisfies Partial<TextFieldOwnProps>;

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

test("it should be invalidated when error prop is true", () => {
  const { invalidated } = mountUseTextField({ error: true });

  expect(invalidated.value).toBe(true);
});

test("it should not be invalidated when error prop is omitted", () => {
  const { invalidated } = mountUseTextField();

  expect(invalidated.value).toBe(false);
});

test("it should render header when label prop is provided", () => {
  const wrapper = mount(TextField, { props: { label: "Email" } });

  expect(wrapper.text()).toContain("Email");
});

test("it should render header when only corner prop is provided", () => {
  const wrapper = mount(TextField, { props: { corner: "Optional" } });

  expect(wrapper.text()).toContain("Optional");
});

test("it should render description when description is set and field is valid", () => {
  const wrapper = mount(TextField, { props: { description: "Helper text" } });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should hide description when field is invalid", () => {
  const wrapper = mount(TextField, {
    props: { error: true, description: "Helper text" },
  });

  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should render error message when errorMessage is set", () => {
  const wrapper = mount(TextField, { props: { errorMessage: "Required" } });

  expect(wrapper.text()).toContain("Required");
});

test("it should hide error message when only error is true", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.find(`[id$="-error"]`).exists()).toBe(false);
});

test("it should render start text when start prop is set", () => {
  const wrapper = mount(TextField, { props: { start: "https://" } });

  expect(wrapper.text()).toContain("https://");
});

test("it should render start icon when startIcon is set", () => {
  const wrapper = mount(TextField, { props: { startIcon: CircleAlert } });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should render error icon when error is true and no end icon", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.find("svg").exists()).toBe(true);
});

test("it should not treat error boolean as end suffix text", () => {
  const { merged } = mountUseTextField({ error: true });

  expect(merged.value.end).toBeUndefined();
});

test("it should render error icon instead of end icon when both are set", () => {
  const wrapper = mount(TextField, {
    props: { error: true, endIcon: CircleAlert },
  });

  expect(wrapper.findAll("svg").length).toBe(1);
});

test("it should hide error icon when withErrorIcon is false", () => {
  const wrapper = mount(TextField, {
    props: { error: true, withErrorIcon: false },
  });

  expect(wrapper.find("svg").exists()).toBe(false);
});

test("it should set aria-invalid on input when error is true", () => {
  const { inputBind } = mountUseTextField({ error: true });

  expect(inputBind.value["aria-invalid"]).toBe(true);
});

test("it should keep error focus ring on container when invalidated", () => {
  const { containerBind } = mountUseTextField({ error: true });

  expect(containerBind.value.class).toContain("focus-within:ring-error-600");
  expect(containerBind.value.class).not.toContain(
    "focus-within:ring-primary-600",
  );
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { inputBind, inputId } = mountUseTextField({ description: "Helper" });

  expect(inputBind.value["aria-describedby"]).toBe(
    `${inputId.value}-description`,
  );
});

test("it should set aria-describedby to error id when errorMessage is shown", () => {
  const { inputBind, inputId } = mountUseTextField({
    errorMessage: "Required",
  });

  expect(inputBind.value["aria-describedby"]).toBe(`${inputId.value}-error`);
});

test("it should use id from fallthrough attrs for inputId", () => {
  const { inputId, inputBind } = mountUseTextField({}, { id: "custom-field" });

  expect(inputId.value).toBe("custom-field");
  expect(inputBind.value.id).toBe("custom-field");
});

test("it should merge class into rootBind", () => {
  const { rootBind } = mountUseTextField({ class: "custom-field" });

  expect(rootBind.value?.class).toContain("w-full");
  expect(rootBind.value?.class).toContain("custom-field");
});

test("it should apply class after classes.root in rootBind", () => {
  const { rootBind } = mountUseTextField({
    class: "p-4",
    classes: { root: "p-2" },
  });

  expect(rootBind.value?.class).toContain("p-4");
  expect(rootBind.value?.class).not.toContain("p-2");
});
