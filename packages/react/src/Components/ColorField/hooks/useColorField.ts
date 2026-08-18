// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import type { ChangeEvent, FocusEvent, KeyboardEvent, MouseEvent } from "react";
import { useCallback, useRef, useState } from "react";

// ** Core Imports
import {
  DEFAULT_COLOR_FORMAT,
  formatColor,
  normalizeColorValue,
  parseColor,
  resolveFieldOverlay,
  resolveFieldPickerClassName,
  toCssRgba,
  type ColorFormat,
} from "@bridge-ui/core/Domain";
import {
  listboxColorProps,
  colorPickerRoundedProps as roundedProps,
  colorPickerSizeProps as sizeProps,
} from "@bridge-ui/core/Tokens";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ColorFieldCustomProps,
  ColorFieldOwnProps,
  ColorFieldProps,
} from "@/Components/ColorField/colorField.types";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/hooks/useFormField";
import {
  derived,
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useBreakpoint,
  useFieldShowFooter,
  usePickerFill,
} from "@/Utils";

const colorFieldBridgeKeys = [
  "fill",
  "alpha",
  "value",
  "format",
  "classes",
  "overlay",
  "editable",
  "swatches",
  "clearable",
  "showFooter",
  "showSwatch",
  "customProps",
  "defaultValue",
] as const satisfies readonly (keyof ColorFieldOwnProps)[];

const CHECKERBOARD_CLASS =
  "bg-[image:repeating-conic-gradient(#d1d5db_0%_25%,#ffffff_0%_50%)] bg-[size:0.5rem_0.5rem] dark:bg-[image:repeating-conic-gradient(#4b5563_0%_25%,#1f2937_0%_50%)]";

function formatFieldValue(value: null | string, format: ColorFormat): string {
  if (isNil(value) || value.length === 0) {
    return "";
  }

  const parsed = parseColor(value);

  if (!parsed) {
    return value;
  }

  return formatColor(parsed, format);
}

export function useColorField(props: ColorFieldProps) {
  const breakpoint = useBreakpoint();
  const containerRef = useRef<null | HTMLElement>(null);

  const {
    slots,
    onOpen,
    onClose,
    onClear,
    onApply,
    onChange,
    onCancel,
    defaultValue,
    value: valueProp,
    ...propsForSplit
  } = props;

  const { footer: footerSlot, ...formFieldSlots } = slots ?? {};

  const openRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState<null | string>(
    () => defaultValue ?? null,
  );
  const [draftText, setDraftText] = useState<null | string>(null);

  const { inheritedAttrs, componentProps: colorOnly } = splitComponentProps<
    ColorFieldProps,
    typeof colorFieldBridgeKeys
  >({
    bridgeKeys: colorFieldBridgeKeys,
    props: propsForSplit as ColorFieldProps,
  });

  const isControlled = derived(() => {
    return valueProp !== undefined;
  });

  const modelValue = derived((): null | string => {
    if (isControlled) {
      return valueProp ?? null;
    }

    return uncontrolledValue;
  });

  const format = derived((): ColorFormat => {
    return colorOnly.format ?? DEFAULT_COLOR_FORMAT;
  });

  const resolvedOverlay = derived(() => {
    return resolveFieldOverlay(colorOnly.overlay, breakpoint.mobile);
  });

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "ColorField",
    showFooter: colorOnly.showFooter,
  });

  const clearable = derived(() => {
    return colorOnly.clearable !== false;
  });

  const showSwatch = derived(() => {
    return colorOnly.showSwatch !== false;
  });

  const hasValue = derived(() => {
    return !isNil(modelValue) && modelValue.length > 0;
  });

  const fill = usePickerFill({
    fill: colorOnly.fill,
    overlay: resolvedOverlay,
    componentName: "ColorField",
  });

  const pickerClassName = derived(() => {
    return resolveFieldPickerClassName(fill, resolvedOverlay);
  });

  const handleContainerRef = useCallback((element: null | HTMLElement) => {
    containerRef.current = element;
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (openRef.current === next) {
        return;
      }

      openRef.current = next;
      setOpen(next);

      if (next) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [onOpen, onClose],
  );

  const inherited = derived(() => {
    return omit(inheritedAttrs, [
      "className",
      "onChange",
      "onClear",
      "onOpen",
      "onClose",
    ]);
  });

  const { componentProps: formFieldCustom } = splitComponentProps<
    Omit<FormFieldOwnProps, "field">,
    typeof formFieldBridgeKeys
  >({
    bridgeKeys: formFieldBridgeKeys,
    props: inherited as Omit<FormFieldOwnProps, "field">,
  });

  const {
    menu: _menu,
    swatch: _swatch,
    clearIcon: _clearIcon,
    colorPicker: _colorPicker,
    ...formFieldOnlyCustom
  } = (colorOnly.customProps ?? {}) as ColorFieldCustomProps;

  const formField = useFormField(
    {
      ...formFieldCustom,
      slots: formFieldSlots,
      classes: colorOnly.classes,
      endIcon:
        formFieldCustom.endIcon ?? (formFieldSlots.end ? undefined : "palette"),
      customProps: {
        ...formFieldOnlyCustom,
        container: mergePartBind(
          formFieldOnlyCustom.container,
          {},
          {
            ref: handleContainerRef,
            className: cn({
              "cursor-pointer": !props.disabled && !props.readonly,
            }),
            onClick: (event: MouseEvent<HTMLElement>) => {
              if (props.disabled || props.readonly) {
                return;
              }

              if ((event.target as HTMLElement).closest("[data-field-clear]")) {
                return;
              }

              handleOpenChange(true);
            },
          },
        ),
      },
    },
    {
      size: "md",
      rounded: "md",
      color: "primary",
      variant: "outline",
      showErrorIcon: true,
    },
    {
      componentName: "ColorField",
    },
  );

  const showClearIcon = derived(() => {
    return hasValue && clearable && !props.readonly && !formField.isDisabled;
  });

  const displayText = derived(() => {
    if (draftText !== null) {
      return draftText;
    }

    return formatFieldValue(modelValue, format);
  });

  const parsedColor = derived(() => {
    return parseColor(modelValue);
  });

  const cssColor = derived(() => {
    return parsedColor ? toCssRgba(parsedColor) : undefined;
  });

  const commitValue = useCallback(
    (next: null | string) => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }

      setDraftText(null);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const commitTypedText = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();

      if (trimmed.length === 0) {
        commitValue(null);

        return;
      }

      const normalized = normalizeColorValue(trimmed, format);

      if (!normalized) {
        setDraftText(null);

        return;
      }

      commitValue(normalized);
    },
    [commitValue, format],
  );

  const clearValue = useCallback(
    (event?: { preventDefault: () => void; stopPropagation: () => void }) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (props.disabled || props.readonly) {
        return;
      }

      commitValue(null);
      onClear?.();
      handleOpenChange(false);
    },
    [onClear, commitValue, handleOpenChange, props.disabled, props.readonly],
  );

  const handleClearPointer = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  const handlePickerChange = (next: null | string) => {
    commitValue(next);

    if (showFooter) {
      onApply?.();
    }
  };

  const handlePickerCancel = () => {
    onCancel?.();
  };

  const inputBind = derived(() => {
    return mergePartBind(
      {
        value: displayText,
        readOnly: colorOnly.editable ? formField.inputBind.readOnly : true,
        onFocus: (event: FocusEvent<HTMLInputElement>) => {
          formField.inputBind.onFocus?.(event as never);
          handleOpenChange(true);
        },
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          formField.inputBind.onChange?.(event as never);

          if (colorOnly.editable) {
            setDraftText(event.target.value);
          }
        },
        onBlur: (event: FocusEvent<HTMLInputElement>) => {
          formField.inputBind.onBlur?.(event as never);

          if (colorOnly.editable && draftText !== null) {
            commitTypedText(draftText);
          }
        },
        onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
          formField.inputBind.onKeyDown?.(event as never);

          if (event.key === "Escape") {
            setDraftText(null);
            handleOpenChange(false);
          }

          if (
            event.key === "Enter" &&
            colorOnly.editable &&
            draftText !== null
          ) {
            event.preventDefault();
            commitTypedText(draftText);
          }
        },
      },
      undefined,
      formField.inputBind,
    );
  });

  const clearIconSize = resolveFieldAdornmentIconSize(formField.merged.size);

  const clearTone = derived(() => {
    return (
      get(listboxColorProps, [formField.merged.color ?? "primary", "clear"]) ??
      "text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300"
    );
  });

  const clearBind = derived(() => {
    return mergePartBind(
      {},
      {},
      {
        tabIndex: 0,
        role: "button",
        "data-field-clear": true,
        onMouseDown: handleClearPointer,
        className: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [clearTone]: true,
          [colorOnly.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  const swatchBind = derived(() => {
    const fieldSwatch = get(sizeProps, [
      formField.merged.size ?? "md",
      "fieldSwatch",
    ]);
    const swatchRounded = get(roundedProps, formField.merged.rounded ?? "md");

    return mergePartBind(
      colorOnly.customProps?.swatch,
      {},
      {
        "aria-hidden": true,
        className: cn({
          "relative shrink-0 overflow-hidden": true,
          [CHECKERBOARD_CLASS]: true,
          [fieldSwatch]: true,
          [swatchRounded]: true,
          [colorOnly.classes?.swatch ?? ""]: true,
        }),
      },
    );
  });

  const swatchFillBind = derived(() => {
    return {
      className: "absolute inset-0",
      style: cssColor ? { backgroundColor: cssColor } : undefined,
    };
  });

  const overlayCustomProps = derived(() => {
    return {
      modal: colorOnly.customProps?.modal,
      drawer: colorOnly.customProps?.drawer,
      menu: {
        anchorEl: containerRef,
        placement: "bottom-start" as const,
        ...colorOnly.customProps?.menu,
      },
    };
  });

  return {
    open,
    fill,
    format,
    cssColor,
    colorOnly,
    formField,
    inputBind,
    clearable,
    clearBind,
    swatchBind,
    footerSlot,
    clearValue,
    modelValue,
    showFooter,
    showSwatch,
    containerRef,
    clearIconSize,
    showClearIcon,
    swatchFillBind,
    pickerClassName,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    overlay: colorOnly.overlay,
    colorPickerCustomProps: colorOnly.customProps?.colorPicker,
  };
}
