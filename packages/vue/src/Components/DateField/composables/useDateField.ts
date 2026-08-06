// ** External Imports
import { isArray, isNil, omit } from "es-toolkit/compat";
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
  resolveDatePickerMode,
  splitComponentProps,
  type DateAdapter,
  type DateAdapterContext,
  type DatePickerModel,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  DateFieldCustomProps,
  DateFieldEmits,
  DateFieldOwnProps,
} from "@/Components/DateField/dateField.types";
import {
  formFieldBridgeKeys,
  useFormField,
} from "@/Components/FormField/composables/useFormField";
import type { FormFieldOwnProps } from "@/Components/FormField/formField.types";
import { hasNamedSlot, mergePartBind } from "@/Utils";

const dateFieldBridgeKeys = [
  "range",
  "classes",
  "maxDate",
  "minDate",
  "multiple",
  "timeZone",
  "hideYears",
  "hideMonths",
  "showFooter",
  "customProps",
  "defaultView",
  "startOfWeek",
  "defaultValue",
  "disableDates",
  "disableYears",
  "hideWeekdays",
  "disableMonths",
] as const satisfies readonly (keyof DateFieldOwnProps)[];

function formatModel(
  value: DatePickerModel,
  adapter: DateAdapter,
  context: DateAdapterContext,
): string {
  if (isNil(value)) {
    return "";
  }

  if (isDateRangeValue(value)) {
    return `${adapter.format(value[0], context)} – ${adapter.format(value[1], context)}`;
  }

  if (isArray(value)) {
    return value.map((entry) => adapter.format(entry, context)).join(", ");
  }

  return adapter.format(value, context);
}

export function useDateField(
  props: DateFieldOwnProps,
  model: Ref<null | undefined | DatePickerModel>,
  emit: SetupContext<DateFieldEmits>["emit"],
) {
  const attrs = useAttrs();
  const slots = useSlots();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const open = ref(false);
  const draftText = ref<null | string>(null);
  const containerRef = ref<null | HTMLElement>(null);

  const split = computed(() => {
    return splitComponentProps<
      DateFieldOwnProps & Record<string, unknown>,
      typeof dateFieldBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: dateFieldBridgeKeys,
    });
  });

  const dateOnly = computed(() => {
    return split.value.componentProps;
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(dateOnly.value.timeZone);
  });
  const mode = computed(() => {
    return resolveDatePickerMode({
      range: dateOnly.value.range,
      multiple: dateOnly.value.multiple,
    });
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
      draftText.value = null;
    }
  }

  const formFieldInput = computed((): Omit<FormFieldOwnProps, "field"> => {
    const inherited = omit(split.value.inheritedAttrs, ["class"]);

    const formFieldCustom = splitComponentProps<
      Omit<FormFieldOwnProps, "field">,
      typeof formFieldBridgeKeys
    >({
      bridgeKeys: formFieldBridgeKeys,
      props: inherited as Omit<FormFieldOwnProps, "field">,
    }).componentProps;

    const endIcon =
      formFieldCustom.endIcon ??
      (hasNamedSlot(slots, "end") ? undefined : "calendar");

    const {
      menu: _menu,
      datePicker: _datePicker,
      ...formFieldOnlyCustom
    } = (dateOnly.value.customProps ?? {}) as DateFieldCustomProps;

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
      componentName: "DateField",
    },
  );

  const displayText = computed(() => {
    if (!isNil(draftText.value)) {
      return draftText.value;
    }

    return formatModel(modelValue.value, adapter.value, context.value);
  });

  function commitValue(next: DatePickerModel) {
    model.value = next;
    emit("change", next);
  }

  function handlePickerChange(next: DatePickerModel) {
    commitValue(next);
    draftText.value = null;

    if (mode.value === "single" && !dateOnly.value.showFooter) {
      handleOpenChange(false);
    }
  }

  function parseDraft() {
    if (isNil(draftText.value)) {
      return;
    }

    if (draftText.value.trim() === "") {
      commitValue(null);
      draftText.value = null;

      return;
    }

    if (mode.value !== "single") {
      draftText.value = null;

      return;
    }

    const parsed = adapter.value.parse(draftText.value, context.value);

    if (!isNil(parsed)) {
      commitValue(parsed);
    }

    draftText.value = null;
  }

  const inputBind = computed(() => {
    return mergePartBind(
      {
        value: displayText.value,
        readonly:
          mode.value !== "single" ? true : formField.inputBind.value.readonly,
        onBlur: (event: FocusEvent) => {
          formField.inputBind.value.onBlur?.(event);
          parseDraft();
        },
        onFocus: (event: FocusEvent) => {
          formField.inputBind.value.onFocus?.(event);
          handleOpenChange(true);
        },
        onInput: (event: Event) => {
          if (mode.value !== "single") {
            return;
          }

          draftText.value = (event.target as HTMLInputElement).value;
        },
        onKeydown: (event: KeyboardEvent) => {
          formField.inputBind.value.onKeydown?.(event);

          if (event.key === "Enter") {
            parseDraft();
          }

          if (event.key === "Escape") {
            draftText.value = null;
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

  const datePickerCustomProps = computed(() => {
    return dateOnly.value.customProps?.datePicker;
  });

  return {
    open,
    mode,
    dateOnly,
    formField,
    inputBind,
    menuProps,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    datePickerCustomProps,
  };
}
