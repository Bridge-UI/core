// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";

// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";

function makeFile(
  name: string,
  options: { size?: number; type?: string; } = {},
) {
  const { size = 4, type = "text/plain" } = options;
  const buffer = new Uint8Array(size);

  return new File([buffer], name, { type });
}

test("it should render the choose file button when empty", () => {
  const wrapper = mount(FileUpload);

  expect(wrapper.text()).toContain("Choose file");
});

test("it should render choose files when multiple is true", () => {
  const wrapper = mount(FileUpload, { props: { multiple: true } });

  expect(wrapper.text()).toContain("Choose files");
});

test("it should render a dropzone when variant is dropzone", () => {
  const wrapper = mount(FileUpload, {
    props: {
      variant: "dropzone",
      title: "Drop images here",
      description: "or click to browse",
    },
  });

  expect(wrapper.text()).toContain("Drop images here");
  expect(wrapper.text()).toContain("or click to browse");
  expect(wrapper.find('[role="button"]').exists()).toBe(true);
});

test("it should render an optional label", () => {
  const wrapper = mount(FileUpload, {
    props: { label: "Attachments" },
  });

  expect(wrapper.text()).toContain("Attachments");
});

test("it should emit update:modelValue when files are selected", async () => {
  const wrapper = mount(FileUpload);
  const input = wrapper.find('input[type="file"]');
  const file = makeFile("note.txt");
  const inputEl = input.element as HTMLInputElement;

  Object.defineProperty(inputEl, "files", {
    value: [file],
    configurable: true,
  });

  await input.trigger("change");

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[file]]);
});

test("it should render a single file as an attachment card without the trigger", () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: { modelValue: [file] },
  });

  expect(wrapper.text()).toContain("note.txt");
  expect(wrapper.text()).toContain("TXT · 12 B");
  expect(wrapper.text()).not.toContain("Choose file");
});

test("it should render the controlled file list and emit remove", async () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: {
      modelValue: [file],
    },
  });

  expect(wrapper.text()).toContain("note.txt");

  await wrapper.find('button[aria-label="Remove note.txt"]').trigger("click");

  expect(wrapper.emitted("remove")?.[0]).toEqual([file, 0]);
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[]]);
});

test("it should reject files that do not match accept", async () => {
  const wrapper = mount(FileUpload, {
    props: { accept: "image/*" },
  });
  const input = wrapper.find('input[type="file"]');
  const inputEl = input.element as HTMLInputElement;

  Object.defineProperty(inputEl, "files", {
    configurable: true,
    value: [makeFile("note.txt", { type: "text/plain" })],
  });

  await input.trigger("change");

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([[]]);
  expect(wrapper.text()).toContain("1 file could not be added.");
});

test("it should use a custom button label", () => {
  const wrapper = mount(FileUpload, {
    props: { buttonLabel: "Browse" },
  });

  expect(wrapper.text()).toContain("Browse");
});
