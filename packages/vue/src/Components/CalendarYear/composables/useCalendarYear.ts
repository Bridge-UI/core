// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

// ** Core Imports
import {
  cn,
  isYearDisabled,
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
  CalendarYearClasses,
  CalendarYearOwnProps,
} from "@/Components/CalendarYear/calendarYear.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const DEFAULT_PAGE_SIZE = 15;

const calendarYearBridgeKeys = [
  "color",
  "value",
  "locale",
  "tokens",
  "classes",
  "maxDate",
  "minDate",
  "disabled",
  "pageSize",
  "readOnly",
  "timeZone",
  "startYear",
  "customProps",
  "disableYears",
] as const satisfies readonly (keyof CalendarYearOwnProps)[];

type CalendarYearLibDefaults = LibDefaultsShape<
  CalendarYearOwnProps,
  "color" | "pageSize"
>;

type CalendarYearMerged = MergeLibDefaults<
  CalendarYearOwnProps,
  CalendarYearLibDefaults
>;

export type CalendarYearCell = {
  disabled: boolean;
  label: string;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
  year: number;
};

export function useCalendarYear(
  props: MaybeRefOrGetter<CalendarYearOwnProps>,
  libDefaults: CalendarYearLibDefaults,
  emit: (event: "change", year: number) => void,
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const bridge = useBridgeUI();

  const split = computed(() => {
    return splitComponentProps<
      CalendarYearOwnProps,
      typeof calendarYearBridgeKeys
    >({
      bridgeKeys: calendarYearBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged } = useBridgeUIComponent<CalendarYearMerged>({
    libDefaults,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarYearClasses>({
    entry: computed(() => undefined),
    props: () => split.value.componentProps,
  });

  const context = computed((): DateAdapterContext => {
    return {
      locale: merged.value.locale ?? bridge?.global.value.locale,
      timeZone: merged.value.timeZone ?? bridge?.global.value.timeZone,
    };
  });

  const pageSize = computed(() => merged.value.pageSize ?? DEFAULT_PAGE_SIZE);

  const startYear = computed(() => {
    if (!isNil(merged.value.startYear)) {
      return merged.value.startYear;
    }

    const focusYear =
      merged.value.value ??
      adapter.value.getYear(adapter.value.now(context.value), context.value);
    const offset = Math.floor(pageSize.value / 2);

    return focusYear - offset;
  });

  const colorTokens = computed(() => {
    return mergeBridgeUILayeredClasses(colorProps, merged.value.tokens?.color);
  });

  const colorClass = computed(() => get(colorTokens.value, merged.value.color));

  const years = computed((): CalendarYearCell[] => {
    return Array.from({ length: pageSize.value }, (_, index) => {
      const year = startYear.value + index;
      const disabled =
        Boolean(merged.value.disabled) ||
        isYearDisabled({
          year,
          adapter: adapter.value,
          context: context.value,
          maxDate: merged.value.maxDate,
          minDate: merged.value.minDate,
          disableYears: merged.value.disableYears,
        });

      const selected =
        !isNil(merged.value.value) && merged.value.value === year;

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        year,
        state,
        selected,
        label: String(year),
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const selectYear = (year: number) => {
    if (merged.value.disabled || merged.value.readOnly) {
      return;
    }

    if (
      isYearDisabled({
        year,
        adapter: adapter.value,
        context: context.value,
        maxDate: merged.value.maxDate,
        minDate: merged.value.minDate,
        disableYears: merged.value.disableYears,
      })
    ) {
      return;
    }

    emit("change", year);
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

  const getYearBind = (cell: CalendarYearCell) => {
    const color = colorClass.value;

    return mergePartBind(
      customProps.value?.year,
      {
        type: "button",
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectYear(cell.year),
      },
      cn({
        "flex h-10 items-center justify-center rounded-md px-2 text-sm transition-colors": true,
        [color?.base ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.hover ?? ""]: cell.state === "base" || cell.state === "hover",
        [color?.selected ?? ""]: cell.state === "selected",
        [color?.disabled ?? ""]: cell.state === "disabled",
        [mergedClasses.value.year ?? ""]: true,
      }),
    );
  };

  return {
    years,
    merged,
    rootBind,
    gridBind,
    pageSize,
    startYear,
    selectYear,
    getYearBind,
  };
}
