// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test, vi } from "vitest";
import { computed, defineComponent, h, ref } from "vue";

// ** Local Imports
import { useFileUpload } from "@/Components/FileUpload/composables/useFileUpload";
import type { FileUploadOwnProps } from "@/Components/FileUpload/fileUpload.types";

const libDefaults = {
  size: "md",
  rounded: "md",
  multiple: false,
  color: "primary",
  variant: "button",
} as const satisfies Partial<FileUploadOwnProps>;

function mountUseFileUpload(props: FileUploadOwnProps = {}) {
  let result!: ReturnType<typeof useFileUpload>;

  const Wrapper = defineComponent({
    setup() {
      const files = ref<File[]>([]);
      const model = computed({
        get: () => files.value,
        set: (next) => {
          files.value = next;
        },
      });
      const emit = vi.fn() as unknown as {
        (event: "remove", file: File, index: number): void;
        (event: "update:modelValue", files: File[]): void;
      };

      result = useFileUpload(props, libDefaults, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper);

  return result;
}

test("it should return default variant as button", () => {
  const result = mountUseFileUpload();

  expect(result.merged.value.variant).toBe("button");
  expect(result.isDropzone.value).toBe(false);
});

test("it should mark dropzone variant", () => {
  const result = mountUseFileUpload({ variant: "dropzone" });

  expect(result.isDropzone.value).toBe(true);
});

test("it should return default size as md", () => {
  const result = mountUseFileUpload();

  expect(result.merged.value.size).toBe("md");
});

test("it should compute rootBind class as a non-empty string", () => {
  const result = mountUseFileUpload();

  expect(typeof result.rootBind.value.class).toBe("string");
  expect(String(result.rootBind.value.class).length).toBeGreaterThan(0);
});

test("it should default buttonLabel based on multiple", () => {
  const single = mountUseFileUpload();
  const multi = mountUseFileUpload({ multiple: true });

  expect(single.buttonLabel.value).toBe("Choose file");
  expect(multi.buttonLabel.value).toBe("Choose files");
});

test("it should default color to primary", () => {
  const result = mountUseFileUpload();

  expect(result.merged.value.color).toBe("primary");
});

test("it should default rounded to md", () => {
  const result = mountUseFileUpload();

  expect(result.merged.value.rounded).toBe("md");
});

test("it should override color when prop is passed", () => {
  const result = mountUseFileUpload({ color: "secondary" });

  expect(result.merged.value.color).toBe("secondary");
});

test("it should override rounded when prop is passed", () => {
  const result = mountUseFileUpload({ rounded: "xl" });

  expect(result.merged.value.rounded).toBe("xl");
});

test("it should apply rounded class on dropzoneBind", () => {
  const result = mountUseFileUpload({
    rounded: "xl",
    variant: "dropzone",
  });

  expect(String(result.dropzoneBind.value.class)).toContain("rounded-xl");
});

test("it should expose dropzoneBind role button", () => {
  const result = mountUseFileUpload({ variant: "dropzone" });

  expect(result.dropzoneBind.value.role).toBe("button");
});
