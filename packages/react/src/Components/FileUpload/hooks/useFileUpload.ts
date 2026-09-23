// ** External Imports
import { get, omit } from "es-toolkit/compat";
import {
  useCallback,
  useEffect,
  useId,
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
  formatFileMeta,
  formatFileSize,
  isImageFile,
  mergeFileUploadSelection,
  removeFileAtIndex,
} from "@bridge-ui/core/Domain";
import {
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
  "error",
  "label",
  "title",
  "value",
  "accept",
  "classes",
  "maxSize",
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
  "size" | "variant" | "multiple"
>;

type FileUploadMerged = MergeLibDefaults<
  FileUploadOwnProps,
  FileUploadLibDefaults
>;

export function useFileUpload(
  props: FileUploadProps,
  libDefaults: FileUploadLibDefaults,
) {
  const autoId = useId();
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

  const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>(
    () => props.defaultValue ?? [],
  );
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  const isControlled = props.value !== undefined;
  const files = isControlled ? (props.value ?? []) : uncontrolledFiles;

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

  const controlId = derived(() => {
    return `bridge-file-upload-${autoId}`;
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

  const variantItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeFileUpload?.tokens?.variant,
    );

    return get(classes, merged.variant);
  }, [merged.variant, bridgeFileUpload?.tokens?.variant]);

  const previewUrls = useMemo(() => {
    return files.map((file) => {
      return isImageFile(file) ? URL.createObjectURL(file) : undefined;
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

  const commitFiles = useCallback(
    (next: File[], rejectedCount: number) => {
      if (!isControlled) {
        setUncontrolledFiles(next);
      }

      props.onChange?.(next);

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
    [isControlled, props],
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
      commitFiles,
      files,
      isDisabled,
      merged.accept,
      merged.maxFiles,
      merged.maxSize,
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

      if (!isControlled) {
        setUncontrolledFiles(next);
      }

      props.onRemove?.(file, index);
      props.onChange?.(next);
      setValidationError(undefined);
    },
    [files, isControlled, isDisabled, props],
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
    [applyIncoming, canAddMore, isDisabled, isDropzone],
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

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "className"]);
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex w-full flex-col": true,
        [get(mergedClasses, "root") ?? ""]: true,
        [inheritedAttrs.className ?? ""]: true,
      }),
    );
  });

  const inputBind = derived(() => {
    return mergePartBind(
      customProps?.input,
      {},
      {
        type: "file",
        tabIndex: -1,
        id: controlId,
        "aria-hidden": true,
        accept: merged.accept,
        multiple: merged.multiple,
        onChange: handleInputChange,
        disabled: isDisabled || !canAddMore,
        className: cn({
          "sr-only": true,
        }),
      },
    );
  });

  const labelBind = derived(() => {
    return mergePartBind(
      customProps?.label,
      {
        htmlFor: controlId,
      },
      cn({
        "mb-1 inline-flex items-center gap-1 text-sm font-medium text-dark-800 dark:text-dark-200": true,
        [get(mergedClasses, "label") ?? ""]: true,
      }),
    );
  });

  const descriptionBind = derived(() => {
    return mergePartBind(
      customProps?.description,
      {},
      cn({
        "mt-1 text-sm text-dark-500 dark:text-dark-400": true,
        [get(mergedClasses, "description") ?? ""]: true,
      }),
    );
  });

  const errorBind = derived(() => {
    return mergePartBind(
      customProps?.errorMessage,
      {
        role: "alert",
      },
      cn({
        "mt-1 text-sm text-error-600 dark:text-error-400": true,
        [get(mergedClasses, "errorMessage") ?? ""]: true,
      }),
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
        [get(variantItem, "surface") ?? ""]: true,
        [get(variantItem, "dragging") ?? ""]: dragging,
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
      return mergePartBind(
        customProps?.item,
        { key: `${files[index]?.name}-${index}` },
        cn({
          [get(sizeItem, "item") ?? ""]: true,
          [get(mergedClasses, "item") ?? ""]: true,
        }),
      );
    },
    [customProps?.item, files, mergedClasses, sizeItem],
  );

  const mediaBind = derived(() => {
    return mergePartBind(
      customProps?.media,
      {},
      cn({
        [get(sizeItem, "media") ?? ""]: true,
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
    return files.map((file, index) => {
      return {
        file,
        index,
        isImage: isImageFile(file),
        previewUrl: previewUrls[index],
        metaLabel: formatFileMeta(file),
        sizeLabel: formatFileSize(file.size),
        remove: () => {
          removeAt(index);
        },
      };
    });
  });

  return {
    files,
    slots,
    merged,
    dragging,
    rootBind,
    listBind,
    labelBind,
    inputBind,
    errorBind,
    mediaBind,
    titleBind,
    controlId,
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
    descriptionBind,
    validationError,
    itemDescriptionBind,
    resolvedErrorMessage,
    inputRef: inputRef as RefObject<null | HTMLInputElement>,
  };
}
