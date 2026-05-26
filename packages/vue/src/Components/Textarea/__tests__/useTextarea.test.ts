// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

// ** Local Imports
import {
  Textarea,
  useTextarea,
  type TextareaOwnProps,
} from "@/Components/Textarea";

const libDefaults = {
  size: "md",
  rounded: "md",
  color: "primary",
  variant: "outline",
} satisfies Partial<TextareaOwnProps>;

function mountUseTextarea(
  props: TextareaOwnProps = {},
  attrs: Record<string, unknown> = {},
) {
  let result!: ReturnType<typeof useTextarea>;
  const textareaRef = ref<HTMLTextAreaElement | null>(null);

  const Wrapper = defineComponent({
    inheritAttrs: false,
    setup() {
      result = useTextarea(props, libDefaults, textareaRef);

      return () => h("div");
    },
  });

  mount(Wrapper, { attrs });

  return result;
}

test("it should merge default color, size, rounded, and variant", () => {
  const { merged } = mountUseTextarea();

  expect(merged.value.size).toBe("md");
  expect(merged.value.rounded).toBe("md");
  expect(merged.value.color).toBe("primary");
  expect(merged.value.variant).toBe("outline");
});

test("it should override color when prop is passed", () => {
  const { merged } = mountUseTextarea({ color: "error" });

  expect(merged.value.color).toBe("error");
});

test("it should override size when prop is passed", () => {
  const { merged, textareaBind } = mountUseTextarea({ size: "2xl" });

  expect(merged.value.size).toBe("2xl");
  expect(textareaBind.value.class).toContain("text-lg");
});

test("it should apply size typography classes on textarea bind", () => {
  const { textareaBind } = mountUseTextarea({ size: "2xs" });

  expect(textareaBind.value.class).toContain("text-2xs");
});

test("it should be disabled when disabled prop is true", () => {
  const { isDisabled } = mountUseTextarea({ disabled: true });

  expect(isDisabled.value).toBe(true);
});

test("it should be readonly when readonly prop is true", () => {
  const { isReadonly } = mountUseTextarea({ readonly: true });

  expect(isReadonly.value).toBe(true);
});

test("it should be invalidated when error prop is true", () => {
  const { invalidated } = mountUseTextarea({ error: true });

  expect(invalidated.value).toBe(true);
});

test("it should not be invalidated when error prop is omitted", () => {
  const { invalidated } = mountUseTextarea();

  expect(invalidated.value).toBe(false);
});

test("it should set aria-describedby to description id when description is shown", () => {
  const { textareaBind, formField } = mountUseTextarea({
    description: "Helper",
  });

  expect(textareaBind.value["aria-describedby"]).toBe(
    `${formField.controlId.value}-description`,
  );
});

test("it should omit description from aria-describedby when field is invalid", () => {
  const { textareaBind } = mountUseTextarea({
    error: true,
    description: "Helper text",
  });

  expect(textareaBind.value["aria-describedby"]).toBeUndefined();
});

test("it should set aria-describedby to error id when errorMessage is set", () => {
  const { textareaBind, formField } = mountUseTextarea({
    errorMessage: "Required",
  });

  expect(textareaBind.value["aria-describedby"]).toBe(
    `${formField.controlId.value}-error`,
  );
});

test("it should set aria-invalid on textarea when error is true", () => {
  const { textareaBind } = mountUseTextarea({ error: true });

  expect(textareaBind.value["aria-invalid"]).toBe(true);
});

test("it should apply error ring classes on container when invalidated", () => {
  const { containerBind } = mountUseTextarea({ error: true });

  expect(containerBind.value.class).toContain("ring-error-500");
});

test("it should use id from attrs for textarea id", () => {
  const { textareaBind } = mountUseTextarea({}, { id: "custom-field" });

  expect(textareaBind.value.id).toBe("custom-field");
});

test("it should merge class with root classes", () => {
  const { rootBind } = mountUseTextarea({ class: "custom-field" });

  expect(rootBind.value.class).toContain("w-full");
  expect(rootBind.value.class).toContain("custom-field");
});

test("it should apply resize-none on textarea when autosize is enabled", () => {
  const { textareaBind } = mountUseTextarea({ autosize: true });

  expect(textareaBind.value.class).toContain("resize-none");
});

test("it should apply resize-y on textarea when autosize is disabled", () => {
  const { textareaBind } = mountUseTextarea();

  expect(textareaBind.value.class).toContain("resize-y");
});

test("it should merge classes.input onto the textarea", () => {
  const { textareaBind } = mountUseTextarea({
    classes: { input: "placeholder:italic" },
  });

  expect(textareaBind.value.class).toContain("placeholder:italic");
});

test("it should apply outline variant container classes by default", () => {
  const { containerBind } = mountUseTextarea();

  expect(containerBind.value.class).toContain("ring-1");
  expect(containerBind.value.class).toContain("ring-inset");
});

test("it should expose the same textarea chrome when mounted as Textarea", () => {
  const wrapper = mount(Textarea, {
    attrs: { id: "notes-field" },
    props: { label: "Notes", description: "Helper" },
  });

  expect(wrapper.text()).toContain("Notes");
  expect(wrapper.text()).toContain("Helper");
  expect(wrapper.find("textarea").attributes("id")).toBe("notes-field");
});
