// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";
import { FileUploadItem } from "@/Components/FileUploadItem";
import { createBridgeUI } from "@/Provider/createBridgeUI";

function makeFile(
  name: string,
  options: { size?: number; type?: string } = {},
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

test("it should render a corner label beside the field label", () => {
  const wrapper = mount(FileUpload, {
    props: { corner: "Optional", label: "Attachments" },
  });

  expect(wrapper.text()).toContain("Optional");
  expect(wrapper.text()).toContain("Attachments");
});

test("it should render the corner slot", () => {
  const wrapper = mount(FileUpload, {
    props: { label: "Attachments" },
    slots: { corner: () => "Later" },
  });

  expect(wrapper.text()).toContain("Later");
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

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([file]);
});

test("it should render a single file as an attachment card without the trigger", () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: { modelValue: file },
  });

  expect(wrapper.text()).toContain("note.txt");
  expect(wrapper.text()).toContain("TXT · 12 B");
  expect(wrapper.text()).not.toContain("Choose file");
});

test("it should render the controlled file list and emit remove", async () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: {
      modelValue: file,
    },
  });

  expect(wrapper.text()).toContain("note.txt");

  await wrapper.find('button[aria-label="Remove note.txt"]').trigger("click");

  expect(wrapper.emitted("remove")?.[0]).toEqual([file, 0]);
  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
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

  expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([null]);
  expect(wrapper.text()).toContain("1 file could not be added.");
});

test("it should use a custom button label", () => {
  const wrapper = mount(FileUpload, {
    props: { buttonLabel: "Browse" },
  });

  expect(wrapper.text()).toContain("Browse");
});

test("it should render a remote attachment card", () => {
  const wrapper = mount(FileUpload, {
    props: {
      modelValue: { size: 946 * 1024, name: "Diploma.pdf" },
    },
  });

  expect(wrapper.text()).toContain("Diploma.pdf");
  expect(wrapper.text()).toContain("PDF · 946 KB");
});

test("it should preview a remote image from its url", () => {
  const wrapper = mount(FileUpload, {
    props: {
      modelValue: {
        size: 10,
        name: "photo.png",
        type: "image/png",
        url: "https://cdn.example/photo.png",
      },
    },
  });

  expect(wrapper.find("img").attributes("src")).toBe(
    "https://cdn.example/photo.png",
  );
});

test("it should keep a remote item when a new file is added", async () => {
  const remote = { size: 100, name: "Diploma.pdf" };
  const wrapper = mount(FileUpload, {
    props: {
      multiple: true,
      accept: "image/*",
      modelValue: [remote],
    },
  });
  const input = wrapper.find('input[type="file"]');
  const inputEl = input.element as HTMLInputElement;

  Object.defineProperty(inputEl, "files", {
    configurable: true,
    value: [makeFile("a.png", { type: "image/png" })],
  });

  await input.trigger("change");

  const next = wrapper.emitted("update:modelValue")?.[0]?.[0] as {
    name: string;
  }[];

  expect(next[0]).toEqual(remote);
  expect(next[1]?.name).toBe("a.png");
});

test("it should replace the default list when the list slot is set", () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: { modelValue: file },
    slots: {
      list: (slotProps: { items: { value: { name: string } }[] }) =>
        h(
          "div",
          slotProps.items.map((item) => item.value.name),
        ),
    },
  });

  expect(wrapper.text()).toContain("note.txt");
  expect(wrapper.find("ul").exists()).toBe(false);
});

test("it should render a start slot and replace the remove button with end", () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: { modelValue: file },
    slots: {
      end: () => "Clear",
      start: () => "Drag",
    },
  });

  expect(wrapper.text()).toContain("Drag");
  expect(wrapper.text()).toContain("Clear");
  expect(wrapper.find('[aria-label="Remove note.txt"]').exists()).toBe(false);
});

test("it should forward attributes on FileUploadItem", () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: { modelValue: file },
    slots: {
      list: (slotProps: { items: { index: number }[] }) =>
        h(
          "div",
          slotProps.items.map((item) =>
            h(FileUploadItem, { ...item, "data-testid": "upload-item" }),
          ),
        ),
    },
  });

  expect(wrapper.find('[data-testid="upload-item"]').exists()).toBe(true);
});

test("it should reuse FileUploadItem inside the list slot", () => {
  const file = makeFile("note.txt", { size: 12 });
  const wrapper = mount(FileUpload, {
    props: { modelValue: file },
    slots: {
      list: (slotProps: { items: { index: number }[] }) =>
        h(
          "div",
          slotProps.items.map((item) =>
            h(FileUploadItem, item, {
              start: () => "Handle",
            }),
          ),
        ),
    },
  });

  expect(wrapper.text()).toContain("Handle");
  expect(wrapper.text()).toContain("note.txt");
  expect(wrapper.find('[aria-label="Remove note.txt"]').exists()).toBe(true);
});

test("it should render upload states on the file card", () => {
  const wrapper = mount(FileUpload, {
    props: {
      onRetry: () => undefined,
      modelValue: {
        progress: 64,
        state: "uploading",
        name: "financial-model.xlsx",
      },
    },
  });

  expect(wrapper.text()).toContain("Uploading · 64%");
  expect(wrapper.text()).toContain("financial-model.xlsx");
});

test("it should retry a failed upload", async () => {
  const onRetry = vi.fn();
  const modelValue = {
    state: "error" as const,
    name: "financial-model.xlsx",
  };
  const wrapper = mount(FileUpload, {
    props: { onRetry, modelValue },
  });

  expect(wrapper.text()).toContain("Upload failed. Try again.");

  await wrapper
    .get('[aria-label="Retry financial-model.xlsx"]')
    .trigger("click");

  expect(onRetry).toHaveBeenCalledWith(modelValue, 0);
});

test("it should hide the meta line at size xs", () => {
  const wrapper = mount(FileUpload, {
    props: {
      size: "xs",
      modelValue: makeFile("notes.pdf", {
        size: 1200,
        type: "application/pdf",
      }),
    },
  });

  expect(wrapper.text()).toContain("notes.pdf");
  expect(wrapper.text()).not.toContain("PDF");
});

test("it should lay vertical cards in a row", () => {
  const wrapper = mount(FileUpload, {
    props: {
      orientation: "vertical",
      modelValue: makeFile("notes.pdf", {
        size: 12,
        type: "application/pdf",
      }),
    },
  });

  expect(wrapper.find("ul").classes()).toContain("flex-row");
  expect(wrapper.find("li").classes()).toContain("flex-col");
});

test("it should hide the state line when description is cleared", () => {
  const empty = mount(FileUpload, {
    props: {
      size: "xs",
      modelValue: {
        description: "",
        name: "report.pdf",
        state: "uploading" as const,
      },
    },
  });

  expect(empty.text()).not.toContain("Uploading");

  const cleared = mount(FileUpload, {
    props: {
      size: "md",
      modelValue: {
        description: null,
        name: "report.pdf",
        state: "error" as const,
      },
    },
  });

  expect(cleared.text()).not.toContain("Upload failed. Try again.");
});

test("it should replace the meta line with a custom description", () => {
  const wrapper = mount(FileUpload, {
    props: {
      modelValue: {
        name: "research-summary.pdf",
        description: "Open preview dialog",
      },
    },
  });

  expect(wrapper.text()).toContain("Open preview dialog");
});

test("it should color the dropzone from the color prop while dragging", async () => {
  const wrapper = mount(FileUpload, {
    props: {
      title: "Drop",
      color: "success",
      variant: "dropzone",
    },
  });
  const zone = wrapper.find('[role="button"]');

  expect(String(zone.attributes("class"))).not.toContain("border-success-500");

  await zone.trigger("dragenter");

  expect(String(zone.attributes("class"))).toContain("bg-success-50");
  expect(String(zone.attributes("class"))).toContain("border-success-500");
  expect(String(zone.attributes("class"))).not.toContain("border-primary-500");
});

test("it should color the dropzone from the registry color while dragging", async () => {
  const wrapper = mount(FileUpload, {
    props: {
      title: "Drop",
      variant: "dropzone",
    },
    global: {
      plugins: [
        createBridgeUI({
          components: {
            FileUpload: { defaultProps: { color: "warning" } },
          },
        }),
      ],
    },
  });
  const zone = wrapper.find('[role="button"]');

  await zone.trigger("dragenter");

  expect(String(zone.attributes("class"))).toContain("border-warning-500");
  expect(String(zone.attributes("class"))).not.toContain("border-primary-500");
});
