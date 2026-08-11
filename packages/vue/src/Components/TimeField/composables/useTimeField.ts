// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  ref,
  useAttrs,
  useSlots,
  type Ref,
  type SetupContext,
} from "vue";

// ** Core Imports
import {
  cn,
  isFieldOverlayDialog,
  resolveFieldOverlay,
  resolveFieldShowFooter,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type TimeValue,
} from "@bridge-ui/core";
import { colorProps as listboxColorProps } from "@bridge-ui/core/Tokens/Listbox";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import type {
  TimeFieldCustomProps,
  TimeFieldEmits,
  TimeFieldOwnProps,
} from "@/Components/TimeField/timeField.types";
import {
  hasNamedSlot,
  mergePartBind,
  resolveFieldAdornmentIconSize,
} from "@/Utils";
import { useBreakpoint } from "@/Utils/useBreakpoint";

const timeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxTime",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
  "clearable",
  "showFooter",
  "customProps",
  "showSeconds",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeFieldOwnProps)[];

function formatTimeValue(
  value: null | TimeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
  showSeconds?: boolean,
): string {
  if (isNil(value)) {
    return "";
  }

  return adapter.formatTime(value, context, { ampm, showSeconds });
}

/**
 * Composes FormField + Menu + TimePicker for a time input field.
 */
export function useTimeField(
  props: TimeFieldOwnProps,
  model: Ref<null | TimeValue | undefined>,
  emit: SetupContext<TimeFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const breakpoint = useBreakpoint();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      TimeFieldOwnProps & Record<string, unknown>,
      typeof timeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: timeFieldBridgeKeys,
    });
  });

  const timeOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(timeOnly.value.timeZone);
  });

  const modelValue = computed(() => {
    return model.value ?? null;
  });

  const clearable = computed(() => {
    return timeOnly.value.clearable !== false;
  });

  const hasValue = computed(() => {
    return !isNil(modelValue.value);
  });

  const resolvedOverlay = computed(() => {
    return resolveFieldOverlay(timeOnly.value.overlay, breakpoint.mobile);
  });

  const pickerClass = computed(() => {
    return isFieldOverlayDialog(resolvedOverlay.value)
      ? "w-full shadow-none"
      : undefined;
  });

  const handleContainerRef = (element: null | Element) => {
    containerRef.value = element instanceof HTMLElement ? element : null;
  };

  function handleOpenChange(next: boolean) {
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

    const endIcon =
      formFieldCustom.endIcon ??
      (hasNamedSlot(slots, "end") ? undefined : "clock");

    const {
      menu: _menu,
      clearIcon: _clearIcon,
      timePicker: _timePicker,
      ...formFieldOnlyCustom
    } = (timeOnly.value.customProps ?? {}) as TimeFieldCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: timeOnly.value.classes,
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
      componentName: "TimeField",
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
    return formatTimeValue(
      modelValue.value,
      adapter.value,
      context.value,
      timeOnly.value.ampm,
      timeOnly.value.showSeconds,
    );
  });

  function commitValue(next: null | TimeValue) {
    model.value = next;
    emit("change", next);
  }

  const showFooter = computed(() => {
    return resolveFieldShowFooter(timeOnly.value.showFooter, breakpoint.mobile);
  });

  function handlePickerChange(next: null | TimeValue) {
    commitValue(next);
    // Close on immediate select or when Apply commits (`showFooter`).
    handleOpenChange(false);
  }

  function handlePickerCancel() {
    handleOpenChange(false);
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
        readonly: true,
        value: displayText.value,
        onFocus: (event: FocusEvent) => {
          formField.inputBind.value.onFocus?.(event);
          handleOpenChange(true);
        },
        onKeydown: (event: KeyboardEvent) => {
          formField.inputBind.value.onKeydown?.(event);

          if (event.key === "Escape") {
            handleOpenChange(false);
          }
        },
      },
      undefined,
      formField.inputBind.value,
    );
  });

  const overlay = computed(() => {
    return timeOnly.value.overlay;
  });

  const overlayCustomProps = computed(() => {
    const menuFromProps = timeOnly.value.customProps?.menu;

    // Menu defaults to `min-w-32`; TimePanel is often slightly narrower (~124px).
    return {
      modal: timeOnly.value.customProps?.modal,
      drawer: timeOnly.value.customProps?.drawer,
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

  const timePickerCustomProps = computed(() => {
    return timeOnly.value.customProps?.timePicker;
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
          [timeOnly.value.classes?.clear ?? ""]: true,
        }),
      },
    );
  });

  return {
    open,
    overlay,
    hasValue,
    timeOnly,
    formField,
    inputBind,
    clearable,
    clearBind,
    clearValue,
    modelValue,
    showFooter,
    pickerClass,
    containerRef,
    clearIconSize,
    showClearIcon,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    timePickerCustomProps,
  };
}
