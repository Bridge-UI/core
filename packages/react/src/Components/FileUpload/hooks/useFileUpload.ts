// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";

// ** Core Imports
import {
  filesFromFileList,
  fileUploadItemsFromModel,
  fileUploadModelFromItems,
  formatFileMeta,
  formatFileSize,
  getFileUploadItemKey,
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
import { useBaseField } from "@/Components/BaseField/hooks/useBaseField";
import type {
  FileUploadOwnProps,
  FileUploadProps,
} from "@/Components/FileUpload/fileUpload.types";
import {
  derived,
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
  "value",
  "accept",
  "classes",
  "maxSize",
  "rounded",
  "variant",
  "disabled",
  "maxFiles",
  "multiple",
  "onChange",
  "onRemove",
  "required",
  "buttonLabel",
  "customProps",
  "description",
  "defaultValue",
  "errorMessage",
] as const satisfies readonly (keyof FileUploadProps)[];

type FileUploadLibDefaults = LibDefaultsShape<
  FileUploadOwnProps,
  "size" | "color" | "rounded" | "variant" | "multiple"
>;

type FileUploadMerged = MergeLibDefaults<
  FileUploadOwnProps,
  FileUploadLibDefaults
>;

export function useFileUpload(
  props: FileUploadProps,
  libDefaults: FileUploadLibDefaults,
) {
  const inputRef = useRef<null | HTMLInputElement>(null);
  const dragDepthRef = useRef(0);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    FileUploadProps,
    typeof fileUploadBridgeKeys
  >({
    props,
    bridgeKeys: fileUploadBridgeKeys,
  });

  const { merged, entry: bridgeFileUpload } = useBridgeUIComponent<
    FileUploadMerged,
    "FileUpload"
  >({
    libDefaults,
    props: componentProps,
    componentName: "FileUpload",
  });

  const [uncontrolledModel, setUncontrolledModel] = useState<FileUploadModel>(
    () => props.defaultValue ?? null,
  );
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  const isControlled = props.value !== undefined;
  const boundModel = isControlled ? (props.value ?? null) : uncontrolledModel;
  const files = useMemo(() => {
    return fileUploadItemsFromModel(boundModel, Boolean(merged.multiple));
  }, [boundModel, merged.multiple]);

  const slots = derived(() => {
    return props.slots;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const isDropzone = derived(() => {
    return merged.variant === "dropzone";
  });

  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const canAddMore = derived(() => {
    if (!merged.multiple) {
      return files.length === 0;
    }

    if (merged.maxFiles != null && merged.maxFiles > 0) {
      return files.length < merged.maxFiles;
    }

    return true;
  });

  const showPicker = derived(() => {
    return canAddMore;
  });

  const resolvedErrorMessage = derived(() => {
    return merged.errorMessage ?? validationError;
  });

  const showError = derived(() => {
    return (
      merged.error === true ||
      (resolvedErrorMessage != null && resolvedErrorMessage !== "")
    );
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeFileUpload,
  });

  const sizeItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeFileUpload?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeFileUpload?.tokens?.size]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeFileUpload?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeFileUpload?.tokens?.rounded]);

  const variantItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFileUpload?.tokens?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeFileUpload?.tokens?.variant]);

  const colorItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeFileUpload?.tokens?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeFileUpload?.tokens?.color]);

  const baseField = useBaseField(
    {
      ...omit(inheritedAttrs, ["slots"]),
      error: showError,
      size: componentProps.size,
      label: componentProps.label,
      disabled: componentProps.disabled,
      required: componentProps.required,
      errorMessage: resolvedErrorMessage,
      description: isDropzone ? undefined : componentProps.description,
      slots: {
        label: slots?.label,
        errorMessage: slots?.errorMessage,
        description: isDropzone ? undefined : slots?.description,
      },
      customProps: {
        root: customProps?.root,
        description: customProps?.description,
        errorMessage: customProps?.errorMessage,
        label: customProps?.label as BaseFieldCustomProps["label"],
      },
      classes: {
        root: componentProps.classes?.root,
        label: componentProps.classes?.label,
        description: componentProps.classes?.description,
        errorMessage: componentProps.classes?.errorMessage,
      },
    },
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

  const previewUrls = useMemo(() => {
    return files.map((value) => {
      if (isFileUploadRemote(value) || !isImageFile(value)) {
        return undefined;
      }

      return URL.createObjectURL(value);
    });
  }, [files]);

  useEffect(() => {
    return () => {
      for (const url of previewUrls) {
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
  }, [previewUrls]);

  const publishModel = useCallback(
    (next: FileUploadValue[]) => {
      const model = fileUploadModelFromItems(next, Boolean(merged.multiple));

      if (!isControlled) {
        setUncontrolledModel(model);
      }

      const onChange = props.onChange as
        undefined | ((value: FileUploadModel) => void);

      onChange?.(model);
    },
    [props, isControlled, merged.multiple],
  );

  const commitFiles = useCallback(
    (next: FileUploadValue[], rejectedCount: number) => {
      publishModel(next);

      if (rejectedCount > 0) {
        setValidationError(
          rejectedCount === 1
            ? "1 file could not be added."
            : `${rejectedCount} files could not be added.`,
        );
      } else {
        setValidationError(undefined);
      }
    },
    [publishModel],
  );

  const applyIncoming = useCallback(
    (incoming: File[]) => {
      if (isDisabled || incoming.length === 0) {
        return;
      }

      const result = mergeFileUploadSelection(files, incoming, {
        accept: merged.accept,
        maxSize: merged.maxSize,
        maxFiles: merged.maxFiles,
        multiple: merged.multiple,
      });

      commitFiles(result.accepted, result.rejected.length);
    },
    [
      files,
      isDisabled,
      commitFiles,
      merged.accept,
      merged.maxSize,
      merged.maxFiles,
      merged.multiple,
    ],
  );

  const openFileDialog = useCallback(() => {
    if (isDisabled || !canAddMore) {
      return;
    }

    inputRef.current?.click();
  }, [canAddMore, isDisabled]);

  const removeAt = useCallback(
    (index: number) => {
      if (isDisabled) {
        return;
      }

      const file = files[index];

      if (!file) {
        return;
      }

      const next = removeFileAtIndex(files, index);

      publishModel(next);
      props.onRemove?.(file, index);
      setValidationError(undefined);
    },
    [files, props, isDisabled, publishModel],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const incoming = filesFromFileList(event.target.files);

      applyIncoming(incoming);
      event.target.value = "";
    },
    [applyIncoming],
  );

  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isDisabled || !isDropzone || !canAddMore) {
        return;
      }

      dragDepthRef.current += 1;
      setDragging(true);
    },
    [canAddMore, isDisabled, isDropzone],
  );

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isDisabled || !isDropzone) {
        return;
      }

      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

      if (dragDepthRef.current === 0) {
        setDragging(false);
      }
    },
    [isDisabled, isDropzone],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (isDisabled || !isDropzone || !canAddMore) {
        return;
      }

      event.dataTransfer.dropEffect = "copy";
    },
    [canAddMore, isDisabled, isDropzone],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      dragDepthRef.current = 0;
      setDragging(false);

      if (isDisabled || !isDropzone || !canAddMore) {
        return;
      }

      applyIncoming(filesFromFileList(event.dataTransfer.files));
    },
    [canAddMore, isDisabled, isDropzone, applyIncoming],
  );

  const handleDropzoneKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      openFileDialog();
    },
    [openFileDialog],
  );

  const inputBind = derived(() => {
    return mergePartBind(
      customProps?.input,
      {},
      {
        type: "file",
        tabIndex: -1,
        "aria-hidden": true,
        accept: merged.accept,
        multiple: merged.multiple,
        onChange: handleInputChange,
        id: `${baseField.controlId}-input`,
        disabled: isDisabled || !canAddMore,
        className: cn({
          "sr-only": true,
        }),
      },
    );
  });

  const triggerBind = derived(() => {
    return mergePartBind(
      customProps?.trigger,
      {},
      cn({
        [get(sizeItem, "trigger") ?? ""]: true,
        [get(mergedClasses, "trigger") ?? ""]: true,
      }),
    );
  });

  const dropzoneBind = derived(() => {
    return mergePartBind(
      customProps?.dropzone,
      {
        role: "button",
        onDrop: handleDrop,
        onClick: openFileDialog,
        onDragOver: handleDragOver,
        onDragEnter: handleDragEnter,
        onDragLeave: handleDragLeave,
        onKeyDown: handleDropzoneKeyDown,
        tabIndex: isDisabled || !canAddMore ? -1 : 0,
        "aria-disabled": isDisabled || !canAddMore || undefined,
      },
      cn({
        [get(sizeItem, "dropzone") ?? ""]: true,
        [roundedClass ?? ""]: true,
        [get(variantItem, "surface") ?? ""]: true,
        [get(colorItem, "dragging") ?? ""]: dragging,
        "cursor-pointer": !isDisabled && canAddMore,
        "pointer-events-none opacity-60": isDisabled || !canAddMore,
        [get(mergedClasses, "dropzone") ?? ""]: true,
      }),
    );
  });

  const listBind = derived(() => {
    return mergePartBind(
      customProps?.list,
      {},
      cn({
        [get(sizeItem, "list") ?? ""]: true,
        [get(mergedClasses, "list") ?? ""]: true,
      }),
    );
  });

  const getItemBind = useCallback(
    (index: number) => {
      const value = files[index];

      return mergePartBind(
        customProps?.item,
        { key: value ? getFileUploadItemKey(value, index) : String(index) },
        cn({
          [get(sizeItem, "item") ?? ""]: true,
          [roundedClass ?? ""]: true,
          [get(mergedClasses, "item") ?? ""]: true,
        }),
      );
    },
    [customProps?.item, files, mergedClasses, roundedClass, sizeItem],
  );

  const mediaBind = derived(() => {
    return mergePartBind(
      customProps?.media,
      {},
      cn({
        [get(sizeItem, "media") ?? ""]: true,
        [roundedClass ?? ""]: true,
        [get(mergedClasses, "media") ?? ""]: true,
      }),
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      {},
      cn({
        [get(sizeItem, "content") ?? ""]: true,
        [get(mergedClasses, "content") ?? ""]: true,
      }),
    );
  });

  const titleBind = derived(() => {
    return mergePartBind(
      customProps?.title,
      {},
      cn({
        [get(sizeItem, "title") ?? ""]: true,
        [get(mergedClasses, "title") ?? ""]: true,
      }),
    );
  });

  const itemDescriptionBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        [get(sizeItem, "description") ?? ""]: true,
      }),
    );
  });

  const actionsBind = derived(() => {
    return mergePartBind(
      customProps?.actions,
      {},
      cn({
        [get(sizeItem, "actions") ?? ""]: true,
        [get(mergedClasses, "actions") ?? ""]: true,
      }),
    );
  });

  const buttonLabel = derived(() => {
    if (merged.buttonLabel != null) {
      return merged.buttonLabel;
    }

    return merged.multiple ? "Choose files" : "Choose file";
  });

  const fileItems = derived(() => {
    return files.map((value, index) => {
      return {
        index,
        value,
        metaLabel: formatFileMeta(value),
        isImage: isImageUploadValue(value),
        sizeLabel: formatFileSize(value.size),
        remove: () => {
          removeAt(index);
        },
        previewUrl: getFileUploadPreviewUrl(value, previewUrls[index]),
      };
    });
  });

  return {
    files,
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
    inputRef: inputRef as RefObject<null | HTMLInputElement>,
  };
}
