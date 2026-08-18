// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, ref, useAttrs, type Ref, type SetupContext } from "vue";

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
  ColorFieldEmits,
  ColorFieldOwnProps,
} from "@/Components/ColorField/colorField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import {
  mergePartBind,
  resolveFieldAdornmentIconSize,
  useFieldShowFooter,
  usePickerFill,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const colorFieldBridgeKeys = [
  "fill",
  "alpha",
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

/**
 * Composes FormField + overlay + ColorPicker for a color input field.
 */
export function useColorField(
  props: ColorFieldOwnProps,
  model: Ref<null | string | undefined>,
  emit: SetupContext<ColorFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const breakpoint = useBreakpoint();

  const open = ref(false);
  const containerRef = ref<null | HTMLElement>(null);
  const draftText = ref<null | string>(null);

  const split = computed(() => {
    return splitComponentProps<
      ColorFieldOwnProps & Record<string, unknown>,
      typeof colorFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: colorFieldBridgeKeys,
    });
  });

  const colorOnly = computed(() => {
    return split.value.componentProps;
  });

  const modelValue = computed(() => {
    return model.value ?? null;
  });

  const format = computed((): ColorFormat => {
    return colorOnly.value.format ?? DEFAULT_COLOR_FORMAT;
  });

  const clearable = computed(() => {
    return colorOnly.value.clearable !== false;
  });

  const showSwatch = computed(() => {
    return colorOnly.value.showSwatch !== false;
  });

  const hasValue = computed(() => {
    return !isNil(modelValue.value) && modelValue.value.length > 0;
  });

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(colorOnly.value.overlay, breakpoint.mobile);
  });

  const fill = usePickerFill({
    overlay: resolvedOverlay,
    componentName: "ColorField",
    fill: () => colorOnly.value.fill,
  });

  const pickerClass = computed(() => {
    return resolveFieldPickerClassName(fill.value, resolvedOverlay.value);
  });

  const handleContainerRef = (element: null | Element) => {
    containerRef.value = element instanceof HTMLElement ? element : null;
  };

  function handleOpenChange(next: boolean) {
    if (open.value === next) {
      return;
    }

    open.value = next;

    if (next) {
      emit("open");
    } else {
      emit("close");
    }
  }

  const inherited = computed(() => {
    return omit(split.value.inheritedAttrs, ["class"]);
  });

  const formFieldInput = computed((): Omit<FormFieldOwnProps, "field"> => {
    const formFieldCustom = splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: inherited.value as Omit<FormFieldOwnProps, "field">,
    }).componentProps;

    const {
      menu: _menu,
      swatch: _swatch,
      clearIcon: _clearIcon,
      colorPicker: _colorPicker,
      ...formFieldOnlyCustom
    } = (colorOnly.value.customProps ?? {}) as ColorFieldCustomProps;

    return {
      ...formFieldCustom,
      classes: colorOnly.value.classes,
      customProps: {
        ...formFieldOnlyCustom,
        container: mergePartBind(
          formFieldOnlyCustom.container,
          {},
          {
            ref: handleContainerRef,
            class: cn({
              "cursor-pointer": !props.disabled && !props.readonly,
            }),
            onClick: (event: MouseEvent) => {
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
    };
  });

  const formField = useFormField(
    () => formFieldInput.value,
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

  const showClearIcon = computed(() => {
    return (
      hasValue.value &&
      clearable.value &&
      !props.readonly &&
      !formField.isDisabled.value
    );
  });

  const displayText = computed(() => {
    if (draftText.value !== null) {
      return draftText.value;
    }

    return formatFieldValue(modelValue.value, format.value);
  });

  const parsedColor = computed(() => {
    return parseColor(modelValue.value);
  });

  const cssColor = computed(() => {
    return parsedColor.value ? toCssRgba(parsedColor.value) : undefined;
  });

  function commitValue(next: null | string) {
    model.value = next;
    draftText.value = null;
    emit("change", next);
  }

  function commitTypedText(raw: string) {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      commitValue(null);

      return;
    }

    const normalized = normalizeColorValue(trimmed, format.value);

    if (!normalized) {
      draftText.value = null;

      return;
    }

    commitValue(normalized);
  }

  const showFooter = useFieldShowFooter({
    overlay: resolvedOverlay,
    componentName: "ColorField",
    showFooter: () => colorOnly.value.showFooter,
  });

  function handlePickerChange(next: null | string) {
    commitValue(next);

    if (showFooter.value) {
      emit("apply");

      return;
    }

    handleOpenChange(false);
  }

  function handlePickerCancel() {
    emit("cancel");
  }

  function clearValue(event?: Event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (props.disabled || props.readonly) {
      return;
    }

    commitValue(null);
    emit("clear");
    handleOpenChange(false);
  }

  function handleClearPointer(event: MouseEvent) {
    event.preventDefault();
  }

  const inputBind = computed(() => {
    return mergePartBind(
      {
        value: displayText.value,
        readonly: colorOnly.value.editable
          ? formField.inputBind.value.readonly
          : true,
        onFocus: (event: FocusEvent) => {
          formField.inputBind.value.onFocus?.(event);
          handleOpenChange(true);
        },
        onBlur: () => {
          if (colorOnly.value.editable && draftText.value !== null) {
            commitTypedText(draftText.value);
          }
        },
        onInput: (event: Event) => {
          if (colorOnly.value.editable) {
            draftText.value = (event.target as HTMLInputElement).value;
          }
        },
        onKeydown: (event: KeyboardEvent) => {
          formField.inputBind.value.onKeydown?.(event);

          if (event.key === "Escape") {
            draftText.value = null;
            handleOpenChange(false);
          }

          if (
            event.key === "Enter" &&
            colorOnly.value.editable &&
            draftText.value !== null
          ) {
            event.preventDefault();
            commitTypedText(draftText.value);
          }
        },
      },
      undefined,
      formField.inputBind.value,
    );
  });

  const overlay = computed(() => {
    return colorOnly.value.overlay;
  });

  const overlayCustomProps = computed(() => {
    const menuFromProps = colorOnly.value.customProps?.menu;

    return {
      modal: colorOnly.value.customProps?.modal,
      drawer: colorOnly.value.customProps?.drawer,
      menu: {
        anchorEl: containerRef.value,
        placement: "bottom-start" as const,
        ...menuFromProps,
        classes: {
          ...menuFromProps?.classes,
          content: cn("min-w-0", menuFromProps?.classes?.content),
        },
      },
    };
  });

  const colorPickerCustomProps = computed(() => {
    return colorOnly.value.customProps?.colorPicker;
  });

  const clearIconSize = computed(() => {
    return resolveFieldAdornmentIconSize(formField.merged.value.size);
  });

  const clearTone = computed(() => {
    return (
      get(listboxColorProps, [
        formField.merged.value.color ?? "primary",
        "clear",
      ]) ??
      "text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300"
    );
  });

  const clearBind = computed(() => {
    return mergePartBind(
      {},
      {},
      {
        tabindex: 0,
        role: "button",
        "data-field-clear": true,
        onMousedown: handleClearPointer,
        class: cn({
          "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm transition-colors duration-150": true,
          [clearTone.value]: true,
          [colorOnly.value.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  const swatchBind = computed(() => {
    const fieldSwatch =
      get(sizeProps, [formField.merged.value.size ?? "md", "fieldSwatch"]) ??
      "h-4 w-4";
    const swatchRounded =
      get(roundedProps, formField.merged.value.rounded ?? "md") ?? "rounded-md";

    return mergePartBind(
      colorOnly.value.customProps?.swatch,
      {
        "aria-hidden": true,
      },
      cn({
        "relative shrink-0 overflow-hidden": true,
        [CHECKERBOARD_CLASS]: true,
        [fieldSwatch]: true,
        [swatchRounded]: true,
        [colorOnly.value.classes?.swatch ?? ""]: true,
      }),
    );
  });

  const swatchFillBind = computed(() => {
    return {
      class: "absolute inset-0",
      style: cssColor.value ? { backgroundColor: cssColor.value } : undefined,
    };
  });

  return {
    open,
    fill,
    format,
    overlay,
    hasValue,
    colorOnly,
    formField,
    inputBind,
    clearable,
    clearBind,
    swatchBind,
    clearValue,
    modelValue,
    showFooter,
    showSwatch,
    pickerClass,
    containerRef,
    clearIconSize,
    showClearIcon,
    swatchFillBind,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    colorPickerCustomProps,
  };
}
