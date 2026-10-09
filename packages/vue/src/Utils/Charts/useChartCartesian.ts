// ** External Imports
import { isArray, isDate, isNil, isString } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import {
  applyChartTone,
  DEFAULT_CHART_AREA_OPACITY,
  DEFAULT_CHART_BAR_RADIUS,
  formatChartValue,
  getChartCartesianItemColors,
  getChartCartesianSummaryParams,
  getChartCartesianTable,
  getChartCartesianTooltip,
  getChartCategoryLabels,
  getChartTimeTickFormatter,
  isChartEmpty,
  isChartTimeCategories,
  type ChartAxisOptions,
  type ChartCartesianRenderOptions,
  type ChartCartesianRenderSeries,
  type ChartCartesianSeriesEntry,
  type ChartCurve,
  type ChartHandle,
  type ChartMountOptions,
  type ChartOrientation,
  type ChartStep,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type {
  ChartCategoryColors,
  ChartRootOwnProps,
} from "@/Utils/Charts/chart.types";
import type {
  ChartBarSeriesRegistration,
  ChartLineSeriesRegistration,
} from "@/Utils/Charts/chartInjectionKey";
import { useChartRegistry } from "@/Utils/Charts/useChartRegistry";
import {
  chartRootBridgeKeys,
  toChartLegendItems,
  useChartColors,
  useChartContextValue,
  useChartFrame,
  useChartPlot,
  useChartRoot,
  type ChartRootMerged,
} from "@/Utils/Charts/useChartRoot";

/**
 * Props shared by `ChartLine` and `ChartBar` (each root exposes its subset).
 */
export type ChartCartesianOwnProps = ChartRootOwnProps & {
  area?: boolean;
  areaOpacity?: number;
  categories: Date[] | string[];
  categoryColors?: ChartCategoryColors;
  curve?: ChartCurve;
  formatDate?: (date: Date) => string;
  formatLabel?: (value: number) => string;
  labels?: boolean;
  orientation?: ChartOrientation;
  radius?: number;
  showPoints?: boolean;
  sparkline?: boolean;
  stack?: string;
  step?: ChartStep;
};

/**
 * Merged cartesian props after registry defaults.
 */
export type ChartCartesianMerged = ChartRootMerged &
  Pick<
    ChartCartesianOwnProps,
    | "area"
    | "step"
    | "curve"
    | "labels"
    | "radius"
    | "showPoints"
    | "areaOpacity"
    | "orientation"
  >;

const cartesianBridgeKeys = [
  ...chartRootBridgeKeys,
  "area",
  "step",
  "curve",
  "stack",
  "labels",
  "radius",
  "sparkline",
  "categories",
  "formatDate",
  "showPoints",
  "areaOpacity",
  "formatLabel",
  "orientation",
  "categoryColors",
] as const satisfies readonly (keyof ChartCartesianOwnProps)[];

const cartesianRegistryKeys = [
  "area",
  "size",
  "step",
  "curve",
  "height",
  "labels",
  "radius",
  "classes",
  "animation",
  "showPoints",
  "areaOpacity",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ChartCartesianOwnProps)[];

type CartesianRegistration =
  ChartBarSeriesRegistration | ChartLineSeriesRegistration;

/**
 * Color id of range `index` of a series.
 */
function toRangeId(seriesId: string, index: number) {
  return `${seriesId}-range-${index}`;
}

/**
 * Resolves a registered series against the root defaults. The root `stack`
 * only applies to series of the root family: a line inside `ChartBar` stacks
 * only with its own `stack`, so it is not piled on top of the bars.
 */
function resolveSeries(
  entry: CartesianRegistration,
  merged: ChartCartesianMerged & { stack?: string },
  kind: "bar" | "line",
): ChartCartesianSeriesEntry {
  if (entry.kind === "bar") {
    return {
      kind: "bar",
      id: entry.id,
      name: entry.name,
      data: entry.data,
      color: entry.color,
      tone: entry.tone ?? "solid",
      reference: entry.reference ?? [],
      colorBy: entry.colorBy ?? "value",
      stack: entry.stack ?? merged.stack,
      colorRanges: entry.colorRanges ?? [],
      labels: entry.labels ?? merged.labels ?? false,
    };
  }

  return {
    kind: "line",
    id: entry.id,
    name: entry.name,
    data: entry.data,
    color: entry.color,
    dashed: entry.dashed ?? false,
    reference: entry.reference ?? [],
    colorBy: entry.colorBy ?? "value",
    colorRanges: entry.colorRanges ?? [],
    area: entry.area ?? merged.area ?? false,
    step: entry.step ?? merged.step ?? false,
    labels: entry.labels ?? merged.labels ?? false,
    curve: entry.curve ?? merged.curve ?? "linear",
    showPoints: entry.showPoints ?? merged.showPoints ?? false,
    stack: entry.stack ?? (kind === "line" ? merged.stack : undefined),
    areaOpacity:
      entry.areaOpacity ?? merged.areaOpacity ?? DEFAULT_CHART_AREA_OPACITY,
  };
}

/**
 * Line / bar root: series registry, category (or time) axis, stacks, and the
 * shared chart frame.
 */
export function useChartCartesian(
  props: ChartCartesianOwnProps,
  {
    kind,
    mount,
    libDefaults,
    componentName,
  }: {
    componentName: "ChartBar" | "ChartLine";
    kind: "bar" | "line";
    libDefaults: Partial<ChartCartesianMerged>;
    mount: (
      options: ChartMountOptions<ChartCartesianRenderOptions>,
    ) => ChartHandle<ChartCartesianRenderOptions>;
  },
) {
  const root = useChartRoot<ChartCartesianMerged>({
    props,
    libDefaults,
    componentName,
    bridgeKeys: cartesianBridgeKeys,
    registryKeys: cartesianRegistryKeys,
    fallbackProps: () => (props.sparkline ? { height: 48 } : {}),
  });

  const registry = useChartRegistry<CartesianRegistration>();

  const { merged, hidden, locale, resolveMessage } = root;

  const categoriesSignature = computed(() => {
    return JSON.stringify(
      (props.categories ?? []).map((category) => {
        return isDate(category) ? { time: category.getTime() } : category;
      }),
    );
  });

  const categories = computed(() => {
    const parsed = JSON.parse(categoriesSignature.value) as Array<
      string | { time: number }
    >;

    return parsed.map((category) => {
      return isString(category) ? category : new Date(category.time);
    });
  });

  const timestamps = computed(() => {
    return isChartTimeCategories(categories.value)
      ? categories.value.map((date) => date.getTime())
      : null;
  });

  const labels = computed(() => {
    return getChartCategoryLabels({
      locale: locale.value,
      categories: categories.value,
      formatDate: props.formatDate,
    });
  });

  const formatLabel = computed(() => {
    const format = props.formatLabel;
    const current = locale.value;

    return format ?? ((value: number) => formatChartValue(value, current));
  });

  const orientation = computed((): ChartOrientation => {
    return kind === "bar"
      ? (merged.value.orientation ?? "vertical")
      : "vertical";
  });

  const series = computed(() => {
    return registry.entries.value.map((entry) => {
      return resolveSeries(
        entry,
        { ...merged.value, stack: props.stack },
        kind,
      );
    });
  });

  // Range colors resolve with the series colors (they are never empty, so
  // they never take a palette entry).
  const colors = useChartColors(root, () => {
    return [
      ...registry.entries.value,
      ...series.value.flatMap((item) => {
        return item.colorRanges.map((range, index) => {
          return { color: range.color, id: toRangeId(item.id, index) };
        });
      }),
    ];
  });

  const categoryItems = computed(() => {
    const categoryColors = kind === "bar" ? props.categoryColors : undefined;

    if (isNil(categoryColors) || categoryColors === false) {
      return [];
    }

    return labels.value.map((label, index) => {
      const color =
        categoryColors === true
          ? undefined
          : isArray(categoryColors)
            ? categoryColors[index]
            : categoryColors[label];

      return { color, id: `category-${index}` };
    });
  });

  const categoryColors = useChartColors(root, () => categoryItems.value);

  const renderSeries = computed((): ChartCartesianRenderSeries[] => {
    const theme = root.theme.value;
    const background = theme?.backgroundColor ?? "";

    const byCategory =
      categoryItems.value.length > 0
        ? categoryItems.value.map((item) => categoryColors.value[item.id] ?? "")
        : null;

    return series.value.map((item) => {
      const tone = item.kind === "bar" ? item.tone : "solid";
      const tint = (color: string) => applyChartTone(color, tone, background);
      const base = tint(colors.value[item.id] ?? "");

      const colorRanges = item.colorRanges.map((range, index) => {
        return {
          ...range,
          color: tint(colors.value[toRangeId(item.id, index)] ?? ""),
        };
      });

      // Category colors paint the bars; the series keeps a neutral color
      // (legend) and its tone.
      const ownCategories = item.kind === "bar" ? byCategory : null;

      return {
        ...item,
        colorRanges,
        color: isNil(ownCategories) ? base : tint(theme?.textColor ?? ""),
        itemColors: getChartCartesianItemColors({
          colorRanges,
          color: base,
          data: item.data,
          colorBy: item.colorBy,
          categoryColors: ownCategories?.map(tint),
        }),
      };
    });
  });

  const visibleSeries = computed((): ChartCartesianRenderSeries[] => {
    return renderSeries.value.filter((item) => {
      return !hidden.value.includes(item.id);
    });
  });

  const seriesColors = computed(() => {
    return Object.fromEntries(
      renderSeries.value.map((item) => [item.id, item.color] as const),
    );
  });

  const axes = computed(() => {
    const xAxis: ChartAxisOptions = { ...registry.axes.value.x };
    const yAxis: ChartAxisOptions = { ...registry.axes.value.y };

    if (!isNil(timestamps.value)) {
      const categoryAxis = orientation.value === "horizontal" ? yAxis : xAxis;

      categoryAxis.formatTick ??= getChartTimeTickFormatter({
        locale: locale.value,
        timestamps: timestamps.value,
      });
    }

    return { xAxis, yAxis };
  });

  const options = computed((): null | ChartCartesianRenderOptions => {
    const theme = root.theme.value;

    if (isNil(theme)) {
      return null;
    }

    return {
      theme,
      xAxis: axes.value.xAxis,
      yAxis: axes.value.yAxis,
      categories: labels.value,
      series: visibleSeries.value,
      timestamps: timestamps.value,
      orientation: orientation.value,
      formatLabel: formatLabel.value,
      animation: root.animation.value,
      width: root.plotSize.value.width,
      height: root.plotSize.value.height,
      sparkline: props.sparkline === true,
      radius: merged.value.radius ?? DEFAULT_CHART_BAR_RADIUS,
    };
  });

  useChartPlot(root, { mount, options });

  const tooltip = computed(() => {
    const index = root.active.value.index;

    if (isNil(index)) {
      return null;
    }

    return getChartCartesianTooltip({
      index,
      series: visibleSeries.value,
      title: labels.value[index] ?? "",
    });
  });

  const frame = useChartFrame(
    root,
    computed(() => {
      return {
        tooltip: tooltip.value,
        count: labels.value.length,
        isEmpty: isChartEmpty(series.value.flatMap((item) => item.data)),
        table: getChartCartesianTable({
          locale: locale.value,
          series: series.value,
          categories: labels.value,
          categoryHeader: resolveMessage(
            isNil(timestamps.value) ? "Category" : "Date",
          ),
        }),
        summary: resolveMessage(
          "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.",
          getChartCartesianSummaryParams({
            series: series.value,
            categories: labels.value,
          }),
        ),
      };
    }),
  );

  const context = useChartContextValue(
    root,
    computed(() => {
      return {
        family: kind,
        tooltip: tooltip.value,
        setAxis: registry.setAxis,
        removeAxis: registry.removeAxis,
        upsertSeries: registry.upsertSeries,
        removeSeries: registry.removeSeries,
        legendItems: toChartLegendItems(
          series.value,
          seriesColors.value,
          hidden.value,
        ),
      };
    }),
  );

  return {
    frame,
    merged,
    context,
    options,
  };
}
