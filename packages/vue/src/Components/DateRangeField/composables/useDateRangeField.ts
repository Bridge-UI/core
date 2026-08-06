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
  isDateRangeValue,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type DateRangeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateRangeFieldCustomProps,
  DateRangeFieldEmits,
  DateRangeFieldOwnProps,
} from "@/Components/DateRangeField/dateRangeField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { hasNamedSlot, mergePartBind } from "@/Utils";

const dateRangeFieldBridgeKeys = [
  "classes",
  "maxDate",
  "minDate",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof DateRangeFieldOwnProps)[];

function formatRange(
  value: null | DateRangeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
): string {
  if (isNil(value) || !isDateRangeValue(value)) {
    return "";
  }

  return `${adapter.format(value[0], context)} – ${adapter.format(value[1], context)}`;
}

export function useDateRangeField(
  props: DateRangeFieldOwnProps,
  model: Ref<null | undefined | DateRangeValue>,
  emit: SetupContext<DateRangeFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      DateRangeFieldOwnProps & Record<string, unknown>,
      typeof dateRangeFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateRangeFieldBridgeKeys,
    });
  });

  const dateOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(dateOnly.value.timeZone);
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
      dateRangePicker: _dateRangePicker,
      ...formFieldOnlyCustom
    } = (dateOnly.value.customProps ?? {}) as DateRangeFieldCustomProps;

    return {
      ...formFieldCustom,
      endIcon,
      classes: dateOnly.value.classes,
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
      componentName: "DateRangeField",
    },
  );

  const displayText = computed(() => {
    return formatRange(modelValue.value, adapter.value, context.value);
  });

  function commitValue(next: null | DateRangeValue) {
    model.value = next;
    emit("change", next);
  }

  function handlePickerChange(next: null | DateRangeValue) {
    commitValue(next);
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

  const menuProps = computed(() => {
    return dateOnly.value.customProps?.menu;
  });

  const dateRangePickerCustomProps = computed(() => {
    return dateOnly.value.customProps?.dateRangePicker;
  });

  return {
    open,
    dateOnly,
    formField,
    inputBind,
    menuProps,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    dateRangePickerCustomProps,
  };
}
