// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
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
  formatFileSize,
  formatFileUploadStatusLabel,
  getFileUploadBrowserFile,
  getFileUploadItemState,
  getFileUploadPreviewUrl,
  isFileUploadRemote,
  isImageUploadValue,
  mergeFileUploadSelection,
  removeFileAtIndex,
  type FileUploadModel,
  type FileUploadValue,
} from "@bridge-ui/core/Domain";
import {
  fileUploadColorProps as colorProps,
  fileUploadOrientationProps as orientationProps,
  fileUploadRoundedProps as roundedProps,
  fileUploadSizeProps as sizeProps,
  fileUploadStateProps as stateProps,
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
  "corner",
  "classes",
  "maxSize",
  "onRetry",
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
  "orientation",
  "defaultValue",
  "errorMessage",
] as const satisfies readonly (keyof FileUploadProps)[];

type FileUploadLibDefaults = LibDefaultsShape<
  FileUploadOwnProps,
  "size" | "color" | "rounded" | "variant" | "multiple" | "orientation"
>;

type FileUploadMerged = MergeLibDefaults<
  FileUploadOwnProps,
  FileUploadLibDefaults
>;

export function useFileUpload(
  props: FileUploadProps,
  libDefaults: FileUploadLibDefaults,
) {
  const dragDepthRef = useRef(0);
  const inputRef = useRef<null | HTMLInputElement>(null);

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

  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();
  const [uncontrolledModel, setUncontrolledModel] = useState<FileUploadModel>(
    () => props.defaultValue ?? null,
  );

  const isControlled = derived(() => {
    return props.value !== undefined;
  });

  const boundModel = derived(() => {
    return isControlled ? (props.value ?? null) : uncontrolledModel;
  });
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

  const orientationItems = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeFileUpload?.tokens?.orientation,
    );
  }, [bridgeFileUpload?.tokens?.orientation]);

  const orientationItem = get(orientationItems, merged.orientation);

  const stateItems = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      stateProps,
      bridgeFileUpload?.tokens?.state,
    );
  }, [bridgeFileUpload?.tokens?.state]);

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
      corner: componentProps.corner,
      disabled: componentProps.disabled,
      required: componentProps.required,
      errorMessage: resolvedErrorMessage,
      description: isDropzone ? undefined : componentProps.description,
      slots: {
        label: slots?.label,
        corner: slots?.corner,
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

  const [previewUrls, setPreviewUrls] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    const urls = files.map((value) => {
      const browserFile = getFileUploadBrowserFile(value);

      if (!browserFile || !isImageUploadValue(value)) {
        return undefined;
      }

      if (isFileUploadRemote(value) && value.url) {
        return undefined;
      }

      return URL.createObjectURL(browserFile);
    });

    setPreviewUrls(urls);

    return () => {
      for (const url of urls) {
        if (url) {
          URL.revokeObjectURL(url);
        }
      }
    };
  }, [files]);

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
      cn(
        get(sizeItem, "list"),
        get(orientationItem, "list"),
        get(mergedClasses, "list"),
      ),
    );
  });

  const getItemBind = useCallback(
    (index: number) => {
      const value = files[index];
      const state = value ? getFileUploadItemState(value) : undefined;
      const stateItem = state ? get(stateItems, state) : undefined;

      return mergePartBind(
        customProps?.item,
        {
          "data-orientation": merged.orientation,
          ...(state ? { "data-state": state } : {}),
        },
        cn(
          get(sizeItem, "item"),
          roundedClass,
          get(orientationItem, "item"),
          stateItem ? get(stateItem, "item") : undefined,
          get(mergedClasses, "item"),
        ),
      );
    },
    [
      files,
      sizeItem,
      stateItems,
      roundedClass,
      mergedClasses,
      orientationItem,
      customProps?.item,
      merged.orientation,
    ],
  );

  const mediaBind = derived(() => {
    return mergePartBind(
      customProps?.media,
      {},
      cn(
        get(sizeItem, "media"),
        roundedClass,
        get(orientationItem, "media"),
        get(mergedClasses, "media"),
      ),
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      customProps?.content,
      {},
      cn(
        get(sizeItem, "content"),
        get(orientationItem, "content"),
        get(mergedClasses, "content"),
      ),
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
      cn(
        get(sizeItem, "actions"),
        get(orientationItem, "actions"),
        get(mergedClasses, "actions"),
      ),
    );
  });

  const retryAt = useCallback(
    (index: number) => {
      if (isDisabled) {
        return;
      }

      const file = files[index];

      if (!file) {
        return;
      }

      props.onRetry?.(file, index);
    },
    [files, props, isDisabled],
  );

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
        isImage: isImageUploadValue(value),
        metaLabel: formatFileUploadStatusLabel(value),
        remove: () => {
          removeAt(index);
        },
        sizeLabel: isNil(value.size) ? "" : formatFileSize(value.size),
        previewUrl: getFileUploadPreviewUrl(value, previewUrls[index]),
        retry: props.onRetry
          ? () => {
              retryAt(index);
            }
          : undefined,
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
    stateItems,
    actionsBind,
    contentBind,
    triggerBind,
    getItemBind,
    buttonLabel,
    dropzoneBind,
    openFileDialog,
    orientationItem,
    validationError,
    orientationItems,
    itemDescriptionBind,
    resolvedErrorMessage,
    inputRef: inputRef as RefObject<null | HTMLInputElement>,
  };
}
