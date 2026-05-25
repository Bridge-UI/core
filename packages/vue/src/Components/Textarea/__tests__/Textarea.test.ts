// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { Textarea } from "@/Components/Textarea";

test("it should render the root element", () => {
  const wrapper = mount(Textarea);

  expect(wrapper.find("textarea").exists()).toBe(true);
  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(Textarea, { props: { label: "Notes" } });

  expect(wrapper.text()).toContain("Notes");
  expect(wrapper.find("label[for]").exists()).toBe(true);
});

test("it should render corner text when corner prop is provided", () => {
  const wrapper = mount(Textarea, { props: { corner: "Optional" } });

  expect(wrapper.text()).toContain("Optional");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mount(Textarea, { props: { description: "Helper text" } });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should hide description when field is invalid", () => {
  const wrapper = mount(Textarea, {
    props: {
      error: true,
      description: "Helper text",
    },
  });

  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mount(Textarea, {
    props: { error: true, errorMessage: "Required" },
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should not render error message when only error is true", () => {
  const wrapper = mount(Textarea, { props: { error: true } });

  expect(wrapper.findAll("p")).toHaveLength(0);
});

test("it should apply disabled attribute on the textarea when disabled", () => {
  const wrapper = mount(Textarea, { props: { disabled: true } });

  expect(wrapper.find("textarea").attributes("disabled")).toBeDefined();
});

test("it should apply readonly attribute on the textarea when readonly", () => {
  const wrapper = mount(Textarea, { props: { readonly: true } });

  expect(wrapper.find("textarea").attributes("readonly")).toBeDefined();
});

test("it should set aria-invalid on the textarea when error is set", () => {
  const wrapper = mount(Textarea, { props: { error: true } });

  expect(wrapper.find("textarea").attributes("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  const wrapper = mount(Textarea, {
    attrs: { id: "field-id" },
    props: { description: "Helper" },
  });

  const textarea = wrapper.find("textarea");

  expect(wrapper.find("#field-id-description").exists()).toBe(true);
  expect(textarea.attributes("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  const wrapper = mount(Textarea, {
    attrs: { id: "field-id" },
    props: { error: true, errorMessage: "Required" },
  });

  const textarea = wrapper.find("textarea");

  expect(wrapper.find("#field-id-error").exists()).toBe(true);
  expect(textarea.attributes("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const wrapper = mount(Textarea, { props: { error: true } });

  expect(wrapper.find(".w-full").attributes("data-invalid")).toBe("true");
});

test("it should render required asterisk when required is true", () => {
  const wrapper = mount(Textarea, {
    props: { label: "Notes", required: true },
  });

  expect(wrapper.text()).toContain("*");
});

test("it should apply error color on the label when error is set", () => {
  const wrapper = mount(Textarea, {
    props: { label: "Notes", error: true },
  });

  const label = wrapper.find('[class*="text-error-600"]');

  expect(label.exists()).toBe(true);
});

test("it should merge class with root classes", () => {
  const wrapper = mount(Textarea, { props: { class: "custom-field" } });

  expect(wrapper.find(".w-full").classes()).toContain("custom-field");
});

test("it should forward fallthrough attrs to the textarea", () => {
  const wrapper = mount(Textarea, {
    attrs: {
      rows: "4",
      id: "field-from-attrs",
      placeholder: "Enter notes",
      "data-testid": "textarea-input",
    },
  });

  const textarea = wrapper.find("#field-from-attrs");

  expect(textarea.exists()).toBe(true);
  expect(textarea.attributes("rows")).toBe("4");
  expect(textarea.attributes("placeholder")).toBe("Enter notes");
  expect(textarea.attributes("data-testid")).toBe("textarea-input");
});

test("it should forward partsProps to the textarea", () => {
  const wrapper = mount(Textarea, {
    props: {
      partsProps: {
        input: { "data-testid": "textarea-input" },
      },
    },
  });

  expect(wrapper.find('[data-testid="textarea-input"]').exists()).toBe(true);
});

test("it should forward partsProps to description", () => {
  const wrapper = mount(Textarea, {
    props: {
      description: "Helper",
      partsProps: {
        description: { "data-testid": "field-description" },
      },
    },
  });

  expect(wrapper.find('[data-testid="field-description"]').exists()).toBe(true);
});

test("it should apply user class after classes.root (tailwind-merge)", () => {
  const wrapper = mount(Textarea, {
    props: {
      class: "p-4",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find(".w-full");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});

test("it should forward FormField classes and partsProps to chrome", () => {
  const wrapper = mount(Textarea, {
    props: {
      label: "Notes",
      corner: "Optional",
      classes: {
        label: "custom-label-class",
        corner: "custom-corner-class",
      },
      partsProps: {
        label: { "data-testid": "field-label" },
        corner: { "data-testid": "field-corner" },
      },
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
  const wrapper = mount(Textarea, {
    props: {
      placeholder: "Type here",
      classes: { input: "placeholder:italic" },
    },
  });

  expect(wrapper.find("textarea").classes()).toContain("placeholder:italic");
});

test("it should render #errorMessage slot as the error region", () => {
  const wrapper = mount(Textarea, {
    props: { error: true },
    slots: {
      errorMessage: () => "Validation failed",
    },
  });

  expect(wrapper.text()).toContain("Validation failed");
});

test("it should update FormField chrome when label and error props change", async () => {
  const wrapper = mount(Textarea, {
    props: {
      label: "First",
      description: "Helper",
    },
  });

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

test("it should update modelValue when textarea changes", async () => {
  const wrapper = mount(Textarea, {
    props: {
      label: "Notes",
      modelValue: "",
      "onUpdate:modelValue": (value: string | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("textarea").setValue("hello");

  expect(wrapper.props("modelValue")).toBe("hello");
});

test("it should apply resize-none when autosize is enabled", () => {
  const wrapper = mount(Textarea, { props: { autosize: true } });

  expect(wrapper.find("textarea").classes()).toContain("resize-none");
});

test("it should apply resize-y when autosize is disabled", () => {
  const wrapper = mount(Textarea);

  expect(wrapper.find("textarea").classes()).toContain("resize-y");
});

test("it should apply error border classes on the textarea when invalid", () => {
  const wrapper = mount(Textarea, { props: { error: true } });

  expect(wrapper.find("textarea").classes()).toContain("border-error-500");
});
