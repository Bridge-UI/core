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
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateTimeFieldCustomProps,
  DateTimeFieldEmits,
  DateTimeFieldOwnProps,
} from "@/Components/DateTimeField/dateTimeField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { hasNamedSlot, mergePartBind } from "@/Utils";

const dateTimeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxDate",
  "maxTime",
  "minDate",
  "minTime",
  "overlay",
  "interval",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableTimes",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
  "hideOutsideDays",
] as const satisfies readonly (keyof DateTimeFieldOwnProps)[];

function formatDateTimeValue(
  value: Date | null,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value)) {
    return "";
  }

  return `${adapter.format(value, context)} ${adapter.formatTime(value, context, { ampm })}`.trim();
}

/**
 * Composes FormField + Menu + DateTimePicker for a date-time input field.
 */
export function useDateTimeField(
  props: DateTimeFieldOwnProps,
  model: Ref<Date | null | undefined>,
  emit: SetupContext<DateTimeFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      DateTimeFieldOwnProps & Record<string, unknown>,
      typeof dateTimeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateTimeFieldBridgeKeys,
    });
  });

  const dateTimeOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(dateTimeOnly.value.timeZone);
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
      (hasNamedSlot(slots, "end") ? undefined : "calendar");

    const {
      menu: _menu,
      dateTimePicker: _dateTimePicker,
      ...formFieldOnlyCustom
    } = (dateTimeOnly.value.customProps ?? {}) as DateTimeFieldCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: dateTimeOnly.value.classes,
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
      componentName: "DateTimeField",
    },
  );

  const displayText = computed(() => {
    return formatDateTimeValue(
      modelValue.value,
      adapter.value,
      context.value,
      dateTimeOnly.value.ampm,
    );
  });

  function commitValue(next: Date | null) {
    model.value = next;
    emit("change", next);
  }

  function handlePickerChange(next: Date | null) {
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
    return dateTimeOnly.value.overlay;
  });

  const overlayCustomProps = computed(() => {
    return {
      modal: dateTimeOnly.value.customProps?.modal,
      drawer: dateTimeOnly.value.customProps?.drawer,
      menu: {
        anchorEl: containerRef.value,
        placement: "bottom-start" as const,
        ...dateTimeOnly.value.customProps?.menu,
      },
    };
  });

  const dateTimePickerCustomProps = computed(() => {
    return dateTimeOnly.value.customProps?.dateTimePicker;
  });

  return {
    open,
    overlay,
    formField,
    inputBind,
    modelValue,
    dateTimeOnly,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    handlePickerCancel,
    overlayCustomProps,
    dateTimePickerCustomProps,
  };
}
