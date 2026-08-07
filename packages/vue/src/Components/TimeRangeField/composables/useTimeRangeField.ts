// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
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
  isTimeRangeValue,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type TimeRangeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import type {
  TimeRangeFieldCustomProps,
  TimeRangeFieldEmits,
  TimeRangeFieldOwnProps,
} from "@/Components/TimeRangeField/timeRangeField.types";
import { hasNamedSlot, mergePartBind } from "@/Utils";

const timeRangeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxTime",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
  "showFooter",
  "customProps",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeRangeFieldOwnProps)[];

function formatTimeRange(
  value: null | TimeRangeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value) || !isTimeRangeValue(value)) {
    return "";
  }

  return `${adapter.formatTime(value[0], context, { ampm })} – ${adapter.formatTime(value[1], context, { ampm })}`;
}

/**
 * Composes FormField + Menu + TimeRangePicker for a time range input field.
 */
export function useTimeRangeField(
  props: TimeRangeFieldOwnProps,
  model: Ref<null | undefined | TimeRangeValue>,
  emit: SetupContext<TimeRangeFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      TimeRangeFieldOwnProps & Record<string, unknown>,
      typeof timeRangeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: timeRangeFieldBridgeKeys,
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
      timeRangePicker: _timeRangePicker,
      ...formFieldOnlyCustom
    } = (timeOnly.value.customProps ?? {}) as TimeRangeFieldCustomProps;

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
            onClick: () => {
              if (!props.disabled && !props.readonly) {
                handleOpenChange(true);
              }
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
      componentName: "TimeRangeField",
    },
  );

  const displayText = computed(() => {
    return formatTimeRange(
      modelValue.value,
      adapter.value,
      context.value,
      timeOnly.value.ampm,
    );
  });

  function commitValue(next: null | TimeRangeValue) {
    model.value = next;
    emit("change", next);
  }

  function handlePickerChange(next: null | TimeRangeValue) {
    commitValue(next);
    // Close on immediate select or when Apply commits (`showFooter`).
    handleOpenChange(false);
  }

  function handlePickerCancel() {
    handleOpenChange(false);
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
    return {
      modal: timeOnly.value.customProps?.modal,
      drawer: timeOnly.value.customProps?.drawer,
      menu: {
        anchorEl: containerRef.value,
        placement: "bottom-start" as const,
        ...timeOnly.value.customProps?.menu,
      },
    };
  });

  const timeRangePickerCustomProps = computed(() => {
    return timeOnly.value.customProps?.timeRangePicker;
  });

  return {
    open,
    overlay,
    timeOnly,
    formField,
    inputBind,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    timeRangePickerCustomProps,
  };
}
