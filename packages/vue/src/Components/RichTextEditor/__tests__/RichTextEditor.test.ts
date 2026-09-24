// ** External Imports
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, expect, test, vi } from "vitest";

// ** Core Imports
import { resetLayerStackForTests } from "@bridge-ui/core/Layer";

// ** Local Imports
import { RichTextEditor } from "@/Components/RichTextEditor";

afterEach(() => {
  vi.unstubAllGlobals();
  resetLayerStackForTests();
  document.body.innerHTML = "";
});

test("it should render a contenteditable surface", async () => {
  const wrapper = mount(RichTextEditor);

  await flushPromises();

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

test("it should set aria-invalid when error is set", async () => {
  const wrapper = mount(RichTextEditor, { props: { error: true } });

  await flushPromises();

  expect(wrapper.find('[role="textbox"]').attributes("aria-invalid")).toBe(
    "true",
  );
});

test("it should update aria-invalid when error changes", async () => {
  const wrapper = mount(RichTextEditor);

  await flushPromises();

  expect(
    wrapper.find('[role="textbox"]').attributes("aria-invalid"),
  ).toBeUndefined();

  await wrapper.setProps({ error: true });
  await flushPromises();

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

  await flushPromises();

  const surface = wrapper.find('[role="textbox"]');
  expect(surface.attributes("contenteditable")).toBe("true");

  surface.element.innerHTML = "<p>Updated</p>";
  await surface.trigger("input");
  await flushPromises();

  expect(wrapper.emitted("update:modelValue")).toBeTruthy();
});

test("it should apply a link from the url field", async () => {
  const prompt = vi.fn();

  vi.stubGlobal("prompt", prompt);
  const wrapper = mount(RichTextEditor, { attachTo: document.body });

  await flushPromises();
  await wrapper.get('[aria-label="Link"]').trigger("click");
  await flushPromises();

  const url = document.body.querySelector(
    'input[aria-label="URL"]',
  ) as HTMLInputElement;

  expect(url).not.toBeNull();
  expect(prompt).not.toHaveBeenCalled();

  url.value = "https://example.com";
  url.dispatchEvent(new Event("input", { bubbles: true }));
  await flushPromises();

  const apply = [...document.body.querySelectorAll("button")].find((button) => {
    return button.textContent === "Apply";
  });

  apply?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('input[aria-label="URL"]')).toBeNull();
  expect(wrapper.get('[aria-label="Link"]').attributes("aria-pressed")).toBe(
    "true",
  );

  wrapper.unmount();
});

test("it should leave the link unset when the url field is cancelled", async () => {
  const wrapper = mount(RichTextEditor, { attachTo: document.body });

  await flushPromises();
  await wrapper.get('[aria-label="Link"]').trigger("click");
  await flushPromises();

  const cancel = [...document.body.querySelectorAll("button")].find(
    (button) => {
      return button.textContent === "Cancel";
    },
  );

  cancel?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();

  expect(document.body.querySelector('input[aria-label="URL"]')).toBeNull();
  expect(wrapper.get('[aria-label="Link"]').attributes("aria-pressed")).toBe(
    "false",
  );

  wrapper.unmount();
});

test("it should remove an active link from the toolbar", async () => {
  const wrapper = mount(RichTextEditor, { attachTo: document.body });

  await flushPromises();
  await wrapper.get('[aria-label="Link"]').trigger("click");
  await flushPromises();

  const url = document.body.querySelector(
    'input[aria-label="URL"]',
  ) as HTMLInputElement;

  url.value = "https://example.com";
  url.dispatchEvent(new Event("input", { bubbles: true }));
  await flushPromises();

  const apply = [...document.body.querySelectorAll("button")].find((button) => {
    return button.textContent === "Apply";
  });

  apply?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await flushPromises();
  await wrapper.get('[aria-label="Link"]').trigger("click");
  await flushPromises();

  expect(document.body.querySelector('input[aria-label="URL"]')).toBeNull();
  expect(wrapper.get('[aria-label="Link"]').attributes("aria-pressed")).toBe(
    "false",
  );

  wrapper.unmount();
});
