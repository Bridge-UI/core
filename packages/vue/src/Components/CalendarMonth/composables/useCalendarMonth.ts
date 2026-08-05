// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

// ** Core Imports
import {
  cn,
  isMonthDisabled,
  mergeBridgeUILayeredClasses,
  resolveCalendarDayInteractionState,
  splitComponentProps,
  type DateAdapterContext,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { colorProps } from "@bridge-ui/core/Tokens/Calendar";

// ** Local Imports
import { useDateAdapter } from "@/Adapters/Date";
import type {
  CalendarMonthClasses,
  CalendarMonthOwnProps,
} from "@/Components/CalendarMonth/calendarMonth.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const calendarMonthBridgeKeys = [
  "year",
  "color",
  "value",
  "locale",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "disabled",
  "readOnly",
  "timeZone",
  "customProps",
  "disableMonths",
] as const satisfies readonly (keyof CalendarMonthOwnProps)[];

type CalendarMonthLibDefaults = LibDefaultsShape<
  CalendarMonthOwnProps,
  "color"
>;

type CalendarMonthMerged = MergeLibDefaults<
  CalendarMonthOwnProps,
  CalendarMonthLibDefaults
>;

export type CalendarMonthCell = {
  disabled: boolean;
  label: string;
  month: number;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
};

export function useCalendarMonth(
  props: MaybeRefOrGetter<CalendarMonthOwnProps>,
  libDefaults: CalendarMonthLibDefaults,
  emit: (event: "change", month: number) => void,
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const bridge = useBridgeUI();

  const split = computed(() => {
    return splitComponentProps<
      CalendarMonthOwnProps,
      typeof calendarMonthBridgeKeys
    >({
      bridgeKeys: calendarMonthBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged } = useBridgeUIComponent<CalendarMonthMerged>({
    libDefaults,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarMonthClasses>({
    entry: computed(() => undefined),
    props: () => split.value.componentProps,
  });

  const context = computed((): DateAdapterContext => {
    return {
      locale: merged.value.locale ?? bridge?.global.value.locale,
      timeZone: merged.value.timeZone ?? bridge?.global.value.timeZone,
    };
  });

  const year = computed(() => {
    return (
      merged.value.year ??
      adapter.value.getYear(adapter.value.now(context.value), context.value)
    );
  });

  const colorTokens = computed(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.value.tokens?.color);
  });

  const colorClass = computed(() => get(colorTokens.value, merged.value.color));

  const months = computed((): CalendarMonthCell[] => {
    const names = adapter.value.getMonthNames(context.value);

    return names.map((label, month) => {
      const disabled =
        Boolean(merged.value.disabled) ||
        isMonthDisabled({
          month,
          year: year.value,
          adapter: adapter.value,
          context: context.value,
          maxDate: merged.value.maxDate,
          minDate: merged.value.minDate,
          disableMonths: merged.value.disableMonths,
        });

      const selected =
        !isNil(merged.value.value) && merged.value.value === month;

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        label,
        month,
        state,
        selected,
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const selectMonth = (month: number) => {
    if (merged.value.disabled || merged.value.readOnly) {
      return;
    }

    if (
      isMonthDisabled({
        month,
        year: year.value,
        adapter: adapter.value,
        context: context.value,
        maxDate: merged.value.maxDate,
        minDate: merged.value.minDate,
        disableMonths: merged.value.disableMonths,
      })
    ) {
      return;
    }

    emit("change", month);
  };

  const rootBind = computed(() => {
    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex flex-col": true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const gridBind = computed(() => {
    return mergePartBind(
      customProps.value?.grid,
      {
        role: "grid",
      },
      cn({
        "grid grid-cols-3 gap-2": true,
        [mergedClasses.value.grid ?? ""]: true,
      }),
    );
  });

  const getMonthBind = (cell: CalendarMonthCell) => {
    const color = colorClass.value;

    return mergePartBind(
      customProps.value?.month,
      {
        type: "button",
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectMonth(cell.month),
      },
      cn({
        "flex h-10 items-center justify-center rounded-md px-2 text-sm uppercase transition-colors": true,
        [color?.base ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.hover ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [mergedClasses.value.month ?? ""]: true,
      }),
    );
  };

  return {
    year,
    merged,
    months,
    rootBind,
    gridBind,
    selectMonth,
    getMonthBind,
  };
}
