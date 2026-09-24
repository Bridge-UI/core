// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  onUnmounted,
  ref,
  useAttrs,
  useSlots,
  watch,
  type Ref,
  type WritableComputedRef,
} from "vue";

// ** Core Imports
import {
  filesFromFileList,
  fileUploadItemsFromModel,
  fileUploadModelFromItems,
  formatFileMeta,
  formatFileSize,
  getFileUploadPreviewUrl,
  isFileUploadRemote,
  isImageFile,
  isImageUploadValue,
  mergeFileUploadSelection,
  removeFileAtIndex,
  type FileUploadModel,
  type FileUploadValue,
} from "@bridge-ui/core/Domain";
import {
  fileUploadColorProps as colorProps,
  fileUploadRoundedProps as roundedProps,
  fileUploadSizeProps as sizeProps,
  fileUploadVariantProps as variantProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { BaseFieldCustomProps } from "@/Components/BaseField/baseField.types";
import { useBaseField } from "@/Components/BaseField/composables/useBaseField";
import type {
  FileUploadOwnProps,
  FileUploadProps,
} from "@/Components/FileUpload/fileUpload.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const fileUploadBridgeKeys = [
  "size",
  "color",
  "error",
  "label",
  "title",
  "accept",
  "classes",
  "maxSize",
  "rounded",
  "variant",
  "disabled",
  "maxFiles",
  "multiple",
  "required",
  "modelValue",
  "buttonLabel",
  "customProps",
  "description",
  "defaultValue",
  "errorMessage",
] as const satisfies readonly (keyof FileUploadProps)[];

type FileUploadLibDefaults = LibDefaultsShape<
  FileUploadOwnProps<boolean>,
  "size" | "color" | "rounded" | "variant" | "multiple"
>;

type FileUploadMerged = MergeLibDefaults<
  FileUploadOwnProps<boolean>,
  FileUploadLibDefaults
>;

export function useFileUpload(
  props: FileUploadOwnProps<boolean>,
  libDefaults: FileUploadLibDefaults,
  model: WritableComputedRef<FileUploadModel>,
  emit: {
    (event: "remove", value: FileUploadValue, index: number): void;
    (event: "update:modelValue", value: FileUploadModel): void;
  },
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const inputRef = ref<null | HTMLInputElement>(null);
  const dragDepth = ref(0);
  const dragging = ref(false);
  const validationError = ref<string | undefined>();
  const previewUrls = ref<(string | undefined)[]>([]);

  const split = computed(() => {
    return splitComponentProps<FileUploadProps, typeof fileUploadBridgeKeys>({
      bridgeKeys: fileUploadBridgeKeys,
      props: { ...attrs, ...props } as FileUploadProps,
    });
  });

  const { merged, entry: bridgeFileUpload } = useBridgeUIComponent<
    FileUploadMerged,
    "FileUpload"
  >({
    libDefaults,
    componentName: "FileUpload",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const isDropzone = computed(() => {
    return merged.value.variant === "dropzone";
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  const files = computed(() => {
    return fileUploadItemsFromModel(
      model.value,
      Boolean(merged.value.multiple),
    );
  });

  const canAddMore = computed(() => {
    if (!merged.value.multiple) {
      return files.value.length === 0;
    }

    if (merged.value.maxFiles != null && merged.value.maxFiles > 0) {
      return files.value.length < merged.value.maxFiles;
    }

    return true;
  });

  const showPicker = computed(() => {
    return canAddMore.value;
  });

  const resolvedErrorMessage = computed(() => {
    return merged.value.errorMessage ?? validationError.value;
  });

  const showError = computed(() => {
    return (
      merged.value.error === true ||
      (resolvedErrorMessage.value != null && resolvedErrorMessage.value !== "")
    );
  });

  const baseField = useBaseField(
    computed(() => {
      return {
        error: showError.value,
        size: split.value.componentProps.size,
        label: split.value.componentProps.label,
        errorMessage: resolvedErrorMessage.value,
        disabled: split.value.componentProps.disabled,
        required: split.value.componentProps.required,
        description: isDropzone.value
          ? undefined
          : split.value.componentProps.description,
        customProps: {
          root: customProps.value?.root,
          description: customProps.value?.description,
          errorMessage: customProps.value?.errorMessage,
          label: customProps.value?.label as BaseFieldCustomProps["label"],
        },
        classes: {
          root: split.value.componentProps.classes?.root,
          label: split.value.componentProps.classes?.label,
          description: split.value.componentProps.classes?.description,
          errorMessage: split.value.componentProps.classes?.errorMessage,
        },
      };
    }),
    {
      error: false,
      hideErrorMessage: false,
      size: libDefaults.size ?? "md",
    },
    {
      componentName: "FileUpload",
      labelHtmlFor: (id) => {
        return `${id}-input`;
      },
    },
  );

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    entry: bridgeFileUpload,
    props: () => split.value.componentProps,
  });

  const sizeItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeFileUpload.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeFileUpload.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const variantItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFileUpload.value?.tokens?.variant,
    );

    return get(classes, merged.value.variant);
  });

  const colorItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeFileUpload.value?.tokens?.color,
    );

    return get(classes, merged.value.color);
  });

  watch(
    files,
    (next) => {
      for (const url of previewUrls.value) {
        if (url) {
          URL.revokeObjectURL(url);
        }
      }

      previewUrls.value = next.map((value) => {
        if (isFileUploadRemote(value) || !isImageFile(value)) {
          return undefined;
        }

        return URL.createObjectURL(value);
      });
    },
    { immediate: true },
  );

  onUnmounted(() => {
    for (const url of previewUrls.value) {
      if (url) {
        URL.revokeObjectURL(url);
      }
    }
  });

  function commitFiles(next: FileUploadValue[], rejectedCount: number) {
    model.value = fileUploadModelFromItems(
      next,
      Boolean(merged.value.multiple),
    );

    if (rejectedCount > 0) {
      validationError.value =
        rejectedCount === 1
          ? "1 file could not be added."
          : `${rejectedCount} files could not be added.`;
    } else {
      validationError.value = undefined;
    }
  }

  function applyIncoming(incoming: File[]) {
    if (isDisabled.value || incoming.length === 0) {
      return;
    }

    const result = mergeFileUploadSelection(files.value, incoming, {
      accept: merged.value.accept,
      maxSize: merged.value.maxSize,
      maxFiles: merged.value.maxFiles,
      multiple: merged.value.multiple,
    });

    commitFiles(result.accepted, result.rejected.length);
  }

  function openFileDialog() {
    if (isDisabled.value || !canAddMore.value) {
      return;
    }

    inputRef.value?.click();
  }

  function removeAt(index: number) {
    if (isDisabled.value) {
      return;
    }

    const file = files.value[index];

    if (!file) {
      return;
    }

    const next = removeFileAtIndex(files.value, index);

    model.value = fileUploadModelFromItems(
      next,
      Boolean(merged.value.multiple),
    );
    emit("remove", file, index);
    validationError.value = undefined;
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const incoming = filesFromFileList(target.files);

    applyIncoming(incoming);
    target.value = "";
  }

  function handleDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (isDisabled.value || !isDropzone.value || !canAddMore.value) {
      return;
    }

    dragDepth.value += 1;
    dragging.value = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (isDisabled.value || !isDropzone.value) {
      return;
    }

    dragDepth.value = Math.max(0, dragDepth.value - 1);

    if (dragDepth.value === 0) {
      dragging.value = false;
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (isDisabled.value || !isDropzone.value || !canAddMore.value) {
      return;
    }

    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.value = 0;
    dragging.value = false;

    if (isDisabled.value || !isDropzone.value || !canAddMore.value) {
      return;
    }

    applyIncoming(filesFromFileList(event.dataTransfer?.files));
  }

  function handleDropzoneKeyDown(event: KeyboardEvent) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openFileDialog();
  }

  const inputBind = computed(() => {
    return mergePartBind(
      customProps.value?.input,
      {},
      {
        type: "file",
        tabIndex: -1,
        "aria-hidden": true,
        accept: merged.value.accept,
        onChange: handleInputChange,
        multiple: merged.value.multiple,
        id: `${baseField.controlId.value}-input`,
        disabled: isDisabled.value || !canAddMore.value,
        class: cn({
          "sr-only": true,
        }),
      },
    );
  });

  const triggerBind = computed(() => {
    return mergePartBind(
      customProps.value?.trigger,
      {},
      cn({
        [get(sizeItem.value, "trigger") ?? ""]: true,
        [get(mergedClasses.value, "trigger") ?? ""]: true,
      }),
    );
  });

  const dropzoneBind = computed(() => {
    return mergePartBind(
      customProps.value?.dropzone,
      {
        role: "button",
        onDrop: handleDrop,
        onClick: openFileDialog,
        onDragover: handleDragOver,
        onDragenter: handleDragEnter,
        onDragleave: handleDragLeave,
        onKeydown: handleDropzoneKeyDown,
        tabindex: isDisabled.value || !canAddMore.value ? -1 : 0,
        "aria-disabled": isDisabled.value || !canAddMore.value || undefined,
      },
      cn({
        [get(sizeItem.value, "dropzone") ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [get(variantItem.value, "surface") ?? ""]: true,
        [get(colorItem.value, "dragging") ?? ""]: dragging.value,
        "cursor-pointer": !isDisabled.value && canAddMore.value,
        "pointer-events-none opacity-60": isDisabled.value || !canAddMore.value,
        [get(mergedClasses.value, "dropzone") ?? ""]: true,
      }),
    );
  });

  const listBind = computed(() => {
    return mergePartBind(
      customProps.value?.list,
      {},
      cn({
        [get(sizeItem.value, "list") ?? ""]: true,
        [get(mergedClasses.value, "list") ?? ""]: true,
      }),
    );
  });

  function getItemBind(_index: number) {
    return mergePartBind(
      customProps.value?.item,
      {},
      cn({
        [get(sizeItem.value, "item") ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [get(mergedClasses.value, "item") ?? ""]: true,
      }),
    );
  }

  const mediaBind = computed(() => {
    return mergePartBind(
      customProps.value?.media,
      {},
      cn({
        [get(sizeItem.value, "media") ?? ""]: true,
        [roundedClass.value ?? ""]: true,
        [get(mergedClasses.value, "media") ?? ""]: true,
      }),
    );
  });

  const contentBind = computed(() => {
    return mergePartBind(
      customProps.value?.content,
      {},
      cn({
        [get(sizeItem.value, "content") ?? ""]: true,
        [get(mergedClasses.value, "content") ?? ""]: true,
      }),
    );
  });

  const titleBind = computed(() => {
    return mergePartBind(
      customProps.value?.title,
      {},
      cn({
        [get(sizeItem.value, "title") ?? ""]: true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    );
  });

  const itemDescriptionBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        [get(sizeItem.value, "description") ?? ""]: true,
      }),
    );
  });

  const actionsBind = computed(() => {
    return mergePartBind(
      customProps.value?.actions,
      {},
      cn({
        [get(sizeItem.value, "actions") ?? ""]: true,
        [get(mergedClasses.value, "actions") ?? ""]: true,
      }),
    );
  });

  const buttonLabel = computed(() => {
    if (merged.value.buttonLabel != null) {
      return merged.value.buttonLabel;
    }

    return merged.value.multiple ? "Choose files" : "Choose file";
  });

  const fileItems = computed(() => {
    return files.value.map((value, index) => {
      return {
        index,
        value,
        metaLabel: formatFileMeta(value),
        isImage: isImageUploadValue(value),
        sizeLabel: formatFileSize(value.size),
        remove: () => {
          removeAt(index);
        },
        previewUrl: getFileUploadPreviewUrl(value, previewUrls.value[index]),
      };
    });
  });

  return {
    slots,
    merged,
    dragging,
    listBind,
    baseField,
    inputBind,
    mediaBind,
    titleBind,
    fileItems,
    showError,
    isDropzone,
    isDisabled,
    showPicker,
    canAddMore,
    actionsBind,
    contentBind,
    triggerBind,
    getItemBind,
    buttonLabel,
    dropzoneBind,
    openFileDialog,
    validationError,
    itemDescriptionBind,
    resolvedErrorMessage,
    inputRef: inputRef as Ref<null | HTMLInputElement>,
  };
}
