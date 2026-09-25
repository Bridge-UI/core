// ** External Imports
import { mount } from "@vue/test-utils";
import { isString } from "es-toolkit/compat";
import { expect, test, vi } from "vitest";
import { computed, defineComponent, h, nextTick, ref } from "vue";

// ** Core Imports
import type { FileUploadModel, FileUploadValue } from "@bridge-ui/core/Domain";

// ** Local Imports
import { useFileUpload } from "@/Components/FileUpload/composables/useFileUpload";
import type { FileUploadOwnProps } from "@/Components/FileUpload/fileUpload.types";
import { createBridgeUI } from "@/Provider/createBridgeUI";

const libDefaults = {
  size: "md",
  rounded: "md",
  multiple: false,
  color: "primary",
  variant: "button",
  orientation: "horizontal",
} as const satisfies Partial<FileUploadOwnProps>;

function mountUseFileUpload(
  props: FileUploadOwnProps<boolean> = {},
  options: { registryColor?: FileUploadOwnProps["color"] } = {},
) {
  let result!: ReturnType<typeof useFileUpload>;

  const Wrapper = defineComponent({
    setup() {
      const files = ref<FileUploadModel>(null);
      const model = computed({
        get: () => files.value,
        set: (next) => {
          files.value = next;
        },
      });
      const emit = vi.fn() as unknown as {
        (event: "remove", value: FileUploadValue, index: number): void;
        (event: "retry", value: FileUploadValue, index: number): void;
        (event: "update:modelValue", value: FileUploadModel): void;
      };

      result = useFileUpload(props, libDefaults, model, emit);

      return () => h("div");
    },
  });

  mount(Wrapper, {
    global: options.registryColor
      ? {
          plugins: [
            createBridgeUI({
              components: {
                FileUpload: {
                  defaultProps: { color: options.registryColor },
                },
              },
            }),
          ],
        }
      : undefined,
  });

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

  expect(isString(result.baseField.rootBind.value.class)).toBe(true);
  expect(String(result.baseField.rootBind.value.class).length).toBeGreaterThan(
    0,
  );
});

test("it should default buttonLabel based on multiple", () => {
  const single = mountUseFileUpload();
  const multi = mountUseFileUpload({ multiple: true });

  expect(multi.buttonLabel.value).toBe("Choose files");
  expect(single.buttonLabel.value).toBe("Choose file");
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

test("it should tint the dropzone with the color prop while dragging", async () => {
  const result = mountUseFileUpload({
    color: "success",
    variant: "dropzone",
  });

  result.dropzoneBind.value.onDragenter?.(new DragEvent("dragenter"));
  await nextTick();

  expect(String(result.dropzoneBind.value.class)).toContain(
    "border-success-500",
  );
  expect(String(result.dropzoneBind.value.class)).not.toContain(
    "border-primary-500",
  );
});

test("it should tint the dropzone with the registry color while dragging", async () => {
  const result = mountUseFileUpload(
    { variant: "dropzone" },
    { registryColor: "info" },
  );

  result.dropzoneBind.value.onDragenter?.(new DragEvent("dragenter"));
  await nextTick();

  expect(String(result.dropzoneBind.value.class)).toContain("border-info-500");
});
