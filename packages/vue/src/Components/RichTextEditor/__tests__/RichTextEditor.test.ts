// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { RichTextEditor } from "@/Components/RichTextEditor";

test("it should render a contenteditable surface", () => {
  const wrapper = mount(RichTextEditor);

  expect(wrapper.find('[role="textbox"]').exists()).toBe(true);
});

test("it should render a label when label prop is provided", () => {
  const wrapper = mount(RichTextEditor, {
    props: { label: "Description" },
  });

  expect(wrapper.text()).toContain("Description");
});

test("it should render description when description prop is provided", () => {
  const wrapper = mount(RichTextEditor, {
    props: { description: "Helper text" },
  });

  expect(wrapper.text()).toContain("Helper text");
});

test("it should render error message when errorMessage prop is provided", () => {
  const wrapper = mount(RichTextEditor, {
    props: { error: true, errorMessage: "Required" },
  });

  expect(wrapper.text()).toContain("Required");
});

test("it should set aria-invalid when error is set", () => {
  const wrapper = mount(RichTextEditor, { props: { error: true } });

  expect(wrapper.find('[role="textbox"]').attributes("aria-invalid")).toBe(
    "true",
  );
});

test("it should render toolbar buttons for default tools", () => {
  const wrapper = mount(RichTextEditor);

  expect(wrapper.find('[role="toolbar"]').exists()).toBe(true);
  expect(wrapper.find('[aria-label="Bold"]').exists()).toBe(true);
});

test("it should hide toolbar when readOnly is true", () => {
  const wrapper = mount(RichTextEditor, { props: { readOnly: true } });

  expect(wrapper.find('[role="toolbar"]').exists()).toBe(false);
});

test("it should limit toolbar tools when tools prop is set", () => {
  const wrapper = mount(RichTextEditor, {
    props: { tools: ["bold", "italic", "link"] },
  });

  expect(wrapper.find('[aria-label="Bold"]').exists()).toBe(true);
  expect(wrapper.find('[aria-label="Link"]').exists()).toBe(true);
  expect(wrapper.find('[aria-label="Heading 1"]').exists()).toBe(false);
});

test("it should emit update:modelValue when content is edited", async () => {
  const wrapper = mount(RichTextEditor, {
    props: {
      modelValue: "<p>Hi</p>",
      "onUpdate:modelValue": (value: unknown) => {
        wrapper.setProps({ modelValue: value });
      },
    },
  });

  await wrapper.vm.$nextTick();

  const surface = wrapper.find('[role="textbox"]');
  expect(surface.attributes("contenteditable")).toBe("true");

  surface.element.innerHTML = "<p>Updated</p>";
  await surface.trigger("input");
  await wrapper.vm.$nextTick();

  expect(wrapper.emitted("update:modelValue")).toBeTruthy();
});
