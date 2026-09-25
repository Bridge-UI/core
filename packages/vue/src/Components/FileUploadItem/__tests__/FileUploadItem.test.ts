// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { h } from "vue";

// ** Local Imports
import { FileUpload } from "@/Components/FileUpload";
import { FileUploadItem } from "@/Components/FileUploadItem";

test("it should render the default card inside FileUpload", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });
  const wrapper = mount(FileUpload, { props: { modelValue: file } });

  expect(wrapper.text()).toContain("note.txt");
  expect(wrapper.find('[aria-label="Remove note.txt"]').exists()).toBe(true);
});

test("it should render an upload error with retry", async () => {
  const onRetry = vi.fn();
  const modelValue = { name: "report.pdf", state: "error" as const };
  const wrapper = mount(FileUpload, {
    props: { onRetry, modelValue },
  });

  await wrapper.get('[aria-label="Retry report.pdf"]').trigger("click");

  expect(onRetry).toHaveBeenCalledTimes(1);
  expect(wrapper.find("li").attributes("data-state")).toBe("error");
});

test("it should replace the state line from the item description", () => {
  const wrapper = mount(FileUpload, {
    props: {
      modelValue: { name: "report.pdf", state: "error" as const },
    },
    slots: {
      list: (slotProps: { items: Record<string, unknown>[] }) =>
        slotProps.items.map((item) =>
          h(FileUploadItem, {
            ...item,
            description: "Open preview dialog",
          }),
        ),
    },
  });

  expect(wrapper.text()).toContain("Open preview dialog");
  expect(wrapper.text()).not.toContain("Upload failed. Try again.");
});

test("it should render FileUploadItem from the list slot", () => {
  const file = new File(["hello"], "note.txt", { type: "text/plain" });
  const wrapper = mount(FileUpload, {
    props: { modelValue: file },
    slots: {
      list: (slotProps: { items: Record<string, unknown>[] }) =>
        slotProps.items.map((item) =>
          h(FileUploadItem, { ...item, "data-testid": "card" }),
        ),
    },
  });

  expect(wrapper.find('[data-testid="card"]').text()).toContain("note.txt");
});
