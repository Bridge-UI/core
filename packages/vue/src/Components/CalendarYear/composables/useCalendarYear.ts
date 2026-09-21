// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { computed, ref, toValue, useAttrs, type MaybeRefOrGetter } from "vue";

// ** Core Imports
import type { DateAdapterContext } from "@bridge-ui/core/Adapters";
import {
  dateFromYear,
  isDateDisabled,
  isDateInRangePreview,
  isDateRangeValue,
  isDateSelected,
  isSameAtGranularity,
  isYearDisabled,
  resolveCalendarDayInteractionState,
  resolveDatePickerMode,
} from "@bridge-ui/core/Domain";
import {
  calendarColorProps as colorProps,
  calendarRoundedProps as roundedProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  getColorToken,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import type {
  CalendarYearClasses,
  CalendarYearOwnProps,
} from "@/Components/CalendarYear/calendarYear.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const DEFAULT_PAGE_SIZE = 15;

const calendarYearBridgeKeys = [
  "color",
  "error",
  "range",
  "value",
  "classes",
  "maxDate",
  "minDate",
  "rounded",
  "disabled",
  "multiple",
  "pageSize",
  "readOnly",
  "timeZone",
  "selection",
  "startYear",
  "customProps",
  "previewDate",
  "disableDates",
  "disableYears",
] as const satisfies readonly (keyof CalendarYearOwnProps)[];

type CalendarYearLibDefaults = LibDefaultsShape<
  CalendarYearOwnProps,
  "color" | "rounded" | "pageSize"
>;

type CalendarYearMerged = MergeLibDefaults<
  CalendarYearOwnProps,
  CalendarYearLibDefaults
>;

export type CalendarYearCell = {
  date: Date;
  disabled: boolean;
  label: string;
  preview: boolean;
  selected: boolean;
  state: ReturnType<typeof resolveCalendarDayInteractionState>;
  year: number;
};

export function useCalendarYear(
  props: MaybeRefOrGetter<CalendarYearOwnProps>,
  libDefaults: CalendarYearLibDefaults,
  emit: {
    (event: "change", year: number): void;
    (event: "previewDateChange", date: Date | null): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();

  const split = computed(() => {
    return splitComponentProps<
      CalendarYearOwnProps,
      typeof calendarYearBridgeKeys
    >({
      bridgeKeys: calendarYearBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeCalendar } = useBridgeUIComponent<
    CalendarYearMerged,
    "Calendar"
  >({
    libDefaults,
    componentName: "Calendar",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, [
      "onChange",
      "onPreviewDateChange",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<CalendarYearClasses>({
    props: () => split.value.componentProps,
    entry: computed(() => {
      return undefined;
    }),
  });

  const context = computed((): DateAdapterContext => {
    return resolveContext(merged.value.timeZone);
  });

  const pageSize = computed(() => {
    return merged.value.pageSize ?? DEFAULT_PAGE_SIZE;
  });

  const startYear = computed(() => {
    if (!isNil(merged.value.startYear)) {
      return merged.value.startYear;
    }

    const focusYear =
      merged.value.value ??
      adapter.value.getYear(adapter.value.now(context.value), context.value);
    const offset = Math.floor(pageSize.value / 2);

    return Math.max(1, focusYear - offset);
  });

  const mode = computed(() => {
    return resolveDatePickerMode({
      range: merged.value.range,
      multiple: merged.value.multiple,
    });
  });

  const isCommitPanel = computed(() => {
    return !isNil(merged.value.selection);
  });

  const uncontrolledPreview = ref<Date | null>(null);

  const previewDate = computed(() => {
    if (!isNil(merged.value.previewDate)) {
      return merged.value.previewDate;
    }

    return uncontrolledPreview.value;
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeCalendar.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeCalendar.value?.tokens?.color,
    );

    return getColorToken({
      tokens: classes,
      color: merged.value.color,
      invalid: merged.value.error,
    });
  });

  const years = computed((): CalendarYearCell[] => {
    return Array.from({ length: pageSize.value }, (_, index) => {
      const year = startYear.value + index;
      const date = dateFromYear({
        year,
        adapter: adapter.value,
        context: context.value,
      });
      const disabled =
        Boolean(merged.value.disabled) ||
        (isCommitPanel.value
          ? isDateDisabled(date, {
              granularity: "year",
              adapter: adapter.value,
              context: context.value,
              maxDate: merged.value.maxDate,
              minDate: merged.value.minDate,
              disableDates: merged.value.disableDates,
              disableYears: merged.value.disableYears,
            })
          : isYearDisabled({
              year,
              adapter: adapter.value,
              context: context.value,
              maxDate: merged.value.maxDate,
              minDate: merged.value.minDate,
              disableYears: merged.value.disableYears,
            }));

      const selected = isCommitPanel.value
        ? isDateSelected({
            date,
            mode: mode.value,
            granularity: "year",
            adapter: adapter.value,
            context: context.value,
            value: merged.value.selection ?? null,
          })
        : !isNil(merged.value.value) && merged.value.value === year;

      const preview =
        isCommitPanel.value &&
        mode.value === "range" &&
        isDateInRangePreview({
          date,
          granularity: "year",
          adapter: adapter.value,
          context: context.value,
          previewDate: previewDate.value,
          value: merged.value.selection ?? null,
        });

      const state = resolveCalendarDayInteractionState({
        disabled,
        selected,
        readOnly: merged.value.readOnly,
      });

      return {
        date,
        year,
        state,
        preview,
        selected,
        label: String(year),
        disabled: disabled || Boolean(merged.value.readOnly),
      };
    });
  });

  const setPreview = (date: Date | null) => {
    if (isNil(merged.value.previewDate)) {
      uncontrolledPreview.value = date;
    }

    emit("previewDateChange", date);
  };

  const canPreviewRange = computed(() => {
    if (
      !isCommitPanel.value ||
      mode.value !== "range" ||
      !isDateRangeValue(merged.value.selection)
    ) {
      return false;
    }

    const [start, end] = merged.value.selection;

    return isSameAtGranularity(
      start,
      end,
      "year",
      adapter.value,
      context.value,
    );
  });

  const selectYear = (year: number) => {
    if (merged.value.disabled || merged.value.readOnly) {
      return;
    }

    const date = dateFromYear({
      year,
      adapter: adapter.value,
      context: context.value,
    });

    if (isCommitPanel.value) {
      if (
        isDateDisabled(date, {
          granularity: "year",
          adapter: adapter.value,
          context: context.value,
          maxDate: merged.value.maxDate,
          minDate: merged.value.minDate,
          disableDates: merged.value.disableDates,
          disableYears: merged.value.disableYears,
        })
      ) {
        return;
      }
    } else if (
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

    if (mode.value === "range") {
      setPreview(null);
    }
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
        onMouseLeave: () => {
          if (canPreviewRange.value) {
            setPreview(null);
          }
        },
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
        type: "button" as const,
        disabled: cell.disabled,
        "aria-pressed": cell.selected,
        onClick: () => selectYear(cell.year),
        "data-preview": cell.preview ? "" : undefined,
        onMouseEnter: () => {
          if (canPreviewRange.value && !cell.disabled) {
            setPreview(cell.date);
          }
        },
      },
      cn({
        "cursor-pointer p-2.5 text-xs uppercase transition-all duration-150 ease-in-out outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed": true,
        [roundedClass.value ?? ""]: true,
        [color?.soft ?? ""]: cell.state === "base",
        [color?.hover ?? ""]: cell.state === "base",
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
