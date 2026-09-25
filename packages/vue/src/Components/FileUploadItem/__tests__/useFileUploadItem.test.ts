// ** External Imports
import { mount } from "@vue/test-utils";
import { expect, test } from "vitest";
import { computed, defineComponent, h, provide } from "vue";

// ** Core Imports
import {
  fileUploadOrientationProps,
  fileUploadStateProps,
} from "@bridge-ui/core/Tokens";

// ** Local Imports
import type { FileUploadItemContextValue } from "@/Components/FileUpload/fileUploadInjectionKey";
import { FILE_UPLOAD_KEY } from "@/Components/FileUpload/fileUploadInjectionKey";
import { useFileUploadItem } from "@/Components/FileUploadItem/composables/useFileUploadItem";
import type { FileUploadItemOwnProps } from "@/Components/FileUploadItem/fileUploadItem.types";

const file = new File(["hello"], "note.txt", { type: "text/plain" });

function contextValue(
  options: { size?: string } = {},
): FileUploadItemContextValue {
  return {
    rounded: "md",
    disabled: false,
    color: "primary",
    orientation: "horizontal",
    size: options.size ?? "md",
    mediaBind: { class: "media" },
    stateItems: fileUploadStateProps,
    actionsBind: { class: "actions" },
    contentBind: { class: "content" },
    descriptionBind: { class: "description" },
    titleBind: { class: "title text-dark-900" },
    orientationItems: fileUploadOrientationProps,
    getItemBind: () => ({ class: "item w-full flex-row" }),
  };
}

function mountUseFileUploadItem(
  props: FileUploadItemOwnProps,
  options: { size?: string } = {},
) {
  let result!: ReturnType<typeof useFileUploadItem>;

  const Host = defineComponent({
    setup() {
      result = useFileUploadItem(props);

      return () => h("div");
    },
  });

  const Wrapper = defineComponent({
    setup() {
      provide(
        FILE_UPLOAD_KEY,
        computed(() => contextValue(options)),
      );

      return () => h(Host);
    },
  });

  mount(Wrapper);

  return { result };
}

test("it should describe a file without an upload state", () => {
  const { result } = mountUseFileUploadItem({
    index: 0,
    value: file,
    isImage: false,
    metaLabel: "TXT",
    sizeLabel: "5 B",
    remove: () => undefined,
  });

  expect(result.statusLabel.value).toContain("TXT");
  expect(result.showDescription.value).toBe(true);
  expect(result.showRetry.value).toBe(false);
  expect(result.media.value).toEqual({
    spin: false,
    kind: "icon",
    icon: "download",
  });
});

test("it should mark an uploading card", () => {
  const { result } = mountUseFileUploadItem(
    {
      index: 0,
      sizeLabel: "",
      isImage: false,
      metaLabel: "PDF",
      remove: () => undefined,
      value: { progress: 64, name: "a.pdf", state: "uploading" },
    },
    { size: "xs" },
  );

  expect(result.statusLabel.value).toBe("Uploading · 64%");
  expect(result.showDescription.value).toBe(true);
  expect(result.media.value).toEqual({
    spin: true,
    kind: "icon",
    icon: "loader",
  });
  expect(String(result.titleBind.value.class)).toContain("animate-pulse");
});

test("it should apply a vertical orientation override", () => {
  const { result } = mountUseFileUploadItem({
    index: 0,
    value: file,
    isImage: false,
    metaLabel: "TXT",
    sizeLabel: "5 B",
    remove: () => undefined,
    orientation: "vertical",
  });

  expect(result.rootBind.value["data-orientation"]).toBe("vertical");
  expect(String(result.rootBind.value.class)).toContain("flex-col");
});
