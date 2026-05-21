// ** External Imports
import { mount } from "@vue/test-utils";
import { CircleAlert } from "lucide-vue-next";
import { expect, test } from "vitest";

// ** Local Imports
import { Icon } from "@/Components/Icon";
import { TextField } from "@/Components/TextField";

test("it should render the root element", () => {
  const wrapper = mount(TextField);

  expect(wrapper.find("input").exists()).toBe(true);
  expect(wrapper.find(".w-full").exists()).toBe(true);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(TextField, { props: { label: "Email" } });

  expect(wrapper.text()).toContain("Email");
  expect(wrapper.find("label[for]").exists()).toBe(true);
});

test("it should render corner text when corner prop is provided", () => {
  const wrapper = mount(TextField, { props: { corner: "Optional" } });

  expect(wrapper.text()).toContain("Optional");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mount(TextField, { props: { description: "Helper text" } });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should hide description when field is invalid", () => {
  const wrapper = mount(TextField, {
    props: {
      error: true,
      description: "Helper text",
    },
  });

  expect(wrapper.text()).not.toContain("Helper text");
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mount(TextField, {
    props: { error: true, errorMessage: "Required" },
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should not render error message when only error is true", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.findAll("p")).toHaveLength(0);
});

test("it should apply disabled attribute on the input when disabled", () => {
  const wrapper = mount(TextField, { props: { disabled: true } });

  expect(wrapper.find("input").attributes("disabled")).toBeDefined();
});

test("it should apply readonly attribute on the input when readonly", () => {
  const wrapper = mount(TextField, { props: { readonly: true } });

  expect(wrapper.find("input").attributes("readonly")).toBeDefined();
});

test("it should set aria-invalid on the input when error is set", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
});

test("it should set aria-describedby to description id when description is shown", () => {
  const wrapper = mount(TextField, {
    attrs: { id: "field-id" },
    props: { description: "Helper" },
  });

  const input = wrapper.find("input");

  expect(wrapper.find("#field-id-description").exists()).toBe(true);
  expect(input.attributes("aria-describedby")).toBe("field-id-description");
});

test("it should set aria-describedby to error id when error is shown", () => {
  const wrapper = mount(TextField, {
    attrs: { id: "field-id" },
    props: { error: true, errorMessage: "Required" },
  });

  const input = wrapper.find("input");

  expect(wrapper.find("#field-id-error").exists()).toBe(true);
  expect(input.attributes("aria-describedby")).toBe("field-id-error");
});

test("it should set data-invalid on the root when error is set", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.find(".w-full").attributes("data-invalid")).toBe("true");
});

test("it should render start text when start prop is set", () => {
  const wrapper = mount(TextField, {
    props: { label: "Website", start: "https://" },
  });

  expect(wrapper.text()).toContain("https://");
});

test("it should render start icon when startIcon prop is set", () => {
  const wrapper = mount(TextField, { props: { startIcon: CircleAlert } });

  expect(wrapper.find("svg").exists()).toBe(true);
  expect(wrapper.find("input").exists()).toBe(true);
});

test("it should render end icon when endIcon prop is set", () => {
  const wrapper = mount(TextField, { props: { endIcon: CircleAlert } });

  expect(wrapper.findAll("svg").length).toBeGreaterThan(0);
});

test("it should render error icon when error is set", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.findAll("svg").length).toBe(1);
  expect(wrapper.findComponent(Icon).exists()).toBe(true);
  expect(wrapper.find(".lucide-circle-alert").exists()).toBe(true);
});

test("it should render error icon instead of end icon when error is set", () => {
  const wrapper = mount(TextField, {
    props: { endIcon: CircleAlert, error: true },
  });

  expect(wrapper.findAll("svg").length).toBe(1);
  expect(wrapper.find(".lucide-circle-alert").exists()).toBe(true);
});

test("it should hide error icon when withErrorIcon is false", () => {
  const wrapper = mount(TextField, {
    props: { error: true, withErrorIcon: false },
  });

  expect(wrapper.findAll("svg").length).toBe(0);
});

test("it should render required asterisk when required is true", () => {
  const wrapper = mount(TextField, {
    props: { label: "Email", required: true },
  });

  expect(wrapper.text()).toContain("*");
});

test("it should apply error color on the label when error is set", () => {
  const wrapper = mount(TextField, {
    props: { label: "Email", error: true },
  });

  const label = wrapper.find('[class*="text-error-600"]');

  expect(label.exists()).toBe(true);
});

test("it should apply error styles on the container when error is set", () => {
  const wrapper = mount(TextField, { props: { error: true } });

  expect(wrapper.find("label").classes()).toContain("ring-error-500");
});

test("it should render start slot content", () => {
  const wrapper = mount(TextField, {
    slots: { start: "$" },
  });

  expect(wrapper.text()).toContain("$");
});

test("it should render end slot content", () => {
  const wrapper = mount(TextField, {
    slots: { end: "€" },
  });

  expect(wrapper.text()).toContain("€");
});

test("it should associate the label with the input via for and id", () => {
  const wrapper = mount(TextField, {
    props: { label: "Email" },
    attrs: { id: "email-field" },
  });

  const input = wrapper.find("#email-field");
  const label = wrapper.find('label[for="email-field"]');

  expect(label.exists()).toBe(true);
  expect(input.exists()).toBe(true);
});

test("it should merge class with root classes", () => {
  const wrapper = mount(TextField, { props: { class: "custom-field" } });

  expect(wrapper.find(".w-full").classes()).toContain("custom-field");
});

test("it should forward fallthrough attrs to the input", () => {
  const wrapper = mount(TextField, {
    attrs: {
      id: "field-from-attrs",
      placeholder: "Enter email",
      "data-testid": "text-field-input",
    },
  });

  const input = wrapper.find("#field-from-attrs");

  expect(input.exists()).toBe(true);
  expect(input.attributes("placeholder")).toBe("Enter email");
  expect(input.attributes("data-testid")).toBe("text-field-input");
});

test("it should forward partsProps to the input", () => {
  const wrapper = mount(TextField, {
    props: {
      partsProps: {
        input: { "data-testid": "text-field-input" },
      },
    },
  });

  expect(wrapper.find('[data-testid="text-field-input"]').exists()).toBe(true);
});

test("it should forward partsProps to description", () => {
  const wrapper = mount(TextField, {
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
  const wrapper = mount(TextField, {
    props: {
      class: "p-4",
      classes: { root: "p-2" },
    },
  });

  const root = wrapper.find(".w-full");

  expect(root.classes()).toContain("p-4");
  expect(root.classes()).not.toContain("p-2");
});

test("it should update modelValue when input changes", async () => {
  const wrapper = mount(TextField, {
    props: {
      label: "Email",
      modelValue: "",
      "onUpdate:modelValue": (value: string | null | undefined) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.find("input").setValue("hello@example.com");

  expect(wrapper.props("modelValue")).toBe("hello@example.com");
});
