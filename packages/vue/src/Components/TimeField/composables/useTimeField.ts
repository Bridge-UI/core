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
  type TimeValue,
} from "@bridge-ui/core";

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
import { hasNamedSlot, mergePartBind } from "@/Utils";

const timeFieldBridgeKeys = [
  "ampm",
  "classes",
  "maxTime",
  "minTime",
  "interval",
  "timeZone",
  "showFooter",
  "customProps",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeFieldOwnProps)[];

function formatTimeValue(
  value: null | TimeValue,
  adapter: DateAdapter,
  context: DateAdapterContext,
  ampm?: boolean,
): string {
  if (isNil(value)) {
    return "";
  }

  return adapter.formatTime(value, context, { ampm });
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
      componentName: "TimeField",
    },
  );

  const displayText = computed(() => {
    return formatTimeValue(
      modelValue.value,
      adapter.value,
      context.value,
      timeOnly.value.ampm,
    );
  });

  function commitValue(next: null | TimeValue) {
    model.value = next;
    emit("change", next);
  }

  function handlePickerChange(next: null | TimeValue) {
    commitValue(next);

    if (!timeOnly.value.showFooter) {
      handleOpenChange(false);
    }
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
    return timeOnly.value.customProps?.menu;
  });

  const timePickerCustomProps = computed(() => {
    return timeOnly.value.customProps?.timePicker;
  });

  return {
    open,
    timeOnly,
    formField,
    inputBind,
    menuProps,
    modelValue,
    containerRef,
    handleOpenChange,
    handlePickerChange,
    timePickerCustomProps,
  };
}
