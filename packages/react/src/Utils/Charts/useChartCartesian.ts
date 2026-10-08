// ** External Imports
import { isDate, isNil, isString } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  DEFAULT_CHART_BAR_RADIUS,
  formatChartValue,
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
  type ChartCategory,
  type ChartCurve,
  type ChartHandle,
  type ChartMountOptions,
  type ChartOrientation,
  type ChartStep,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartRootOwnProps } from "@/Utils/Charts/chart.types";
import type {
  ChartBarSeriesRegistration,
  ChartLineSeriesRegistration,
} from "@/Utils/Charts/ChartContext";
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
  type ChartRootProps,
} from "@/Utils/Charts/useChartRoot";
import { useLatestCallback } from "@/Utils/Charts/useLatestCallback";

/**
 * Props shared by `ChartLine` and `ChartBar` (each root exposes its subset).
 */
export type ChartCartesianOwnProps = ChartRootOwnProps & {
  area?: boolean;
  categories: Date[] | string[];
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
  "formatLabel",
  "orientation",
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
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ChartCartesianOwnProps)[];

type CartesianRegistration =
  ChartBarSeriesRegistration | ChartLineSeriesRegistration;

/**
 * Stable snapshot of `categories`: same identity while labels and dates
 * are unchanged.
 */
function useStableCategories(
  categories: undefined | readonly ChartCategory[],
): ChartCategory[] {
  const signature = JSON.stringify(
    (categories ?? []).map((category) => {
      return isDate(category) ? { time: category.getTime() } : category;
    }),
  );

  return useMemo(() => {
    const parsed = JSON.parse(signature) as Array<string | { time: number }>;

    return parsed.map((category) => {
      return isString(category) ? category : new Date(category.time);
    });
  }, [signature]);
}

/**
 * Resolves a registered series against the root defaults.
 */
function resolveSeries(
  entry: CartesianRegistration,
  merged: ChartCartesianMerged & { stack?: string },
): ChartCartesianSeriesEntry {
  if (entry.kind === "bar") {
    return {
      kind: "bar",
      id: entry.id,
      name: entry.name,
      data: entry.data,
      color: entry.color,
      reference: entry.reference ?? [],
      stack: entry.stack ?? merged.stack,
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
    stack: entry.stack ?? merged.stack,
    area: entry.area ?? merged.area ?? false,
    step: entry.step ?? merged.step ?? false,
    labels: entry.labels ?? merged.labels ?? false,
    curve: entry.curve ?? merged.curve ?? "linear",
    showPoints: entry.showPoints ?? merged.showPoints ?? false,
  };
}

/**
 * Line / bar root: series registry, category (or time) axis, stacks, and the
 * shared chart frame.
 */
export function useChartCartesian(
  props: ChartRootProps & ChartCartesianOwnProps,
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
    fallbackProps: props.sparkline ? { height: 48 } : undefined,
  });

  const registry = useChartRegistry<CartesianRegistration>();

  const { theme, merged, hidden, locale, active, plotSize, animation } = root;
  const { resolveMessage } = root;

  const sparkline = props.sparkline === true;
  const stack = props.stack;

  const formatDate = useLatestCallback(props.formatDate);
  const formatLabelProp = useLatestCallback(props.formatLabel);

  const categories = useStableCategories(props.categories);

  const timestamps = useMemo(() => {
    return isChartTimeCategories(categories)
      ? categories.map((date) => date.getTime())
      : null;
  }, [categories]);

  const labels = useMemo(() => {
    return getChartCategoryLabels({ locale, categories, formatDate });
  }, [locale, categories, formatDate]);

  const formatLabel = useMemo(() => {
    return (
      formatLabelProp ?? ((value: number) => formatChartValue(value, locale))
    );
  }, [locale, formatLabelProp]);

  const orientation: ChartOrientation =
    kind === "bar" ? (merged.orientation ?? "vertical") : "vertical";

  const series = useMemo(() => {
    return registry.entries.map((entry) => {
      return resolveSeries(entry, { ...merged, stack });
    });
  }, [stack, merged, registry.entries]);

  const colors = useChartColors(root, registry.entries);

  const visibleSeries = useMemo((): ChartCartesianRenderSeries[] => {
    return series
      .filter((item) => !hidden.includes(item.id))
      .map((item) => ({ ...item, color: colors[item.id] ?? "" }));
  }, [colors, hidden, series]);

  const axes = useMemo(() => {
    const xAxis: ChartAxisOptions = { ...registry.axes.x };
    const yAxis: ChartAxisOptions = { ...registry.axes.y };

    if (!isNil(timestamps)) {
      const categoryAxis = orientation === "horizontal" ? yAxis : xAxis;

      categoryAxis.formatTick ??= getChartTimeTickFormatter({
        locale,
        timestamps,
      });
    }

    return { xAxis, yAxis };
  }, [locale, timestamps, orientation, registry.axes]);

  const options = useMemo((): null | ChartCartesianRenderOptions => {
    if (isNil(theme)) {
      return null;
    }

    return {
      theme,
      sparkline,
      animation,
      timestamps,
      formatLabel,
      orientation,
      xAxis: axes.xAxis,
      yAxis: axes.yAxis,
      categories: labels,
      series: visibleSeries,
      width: plotSize.width,
      height: plotSize.height,
      radius: merged.radius ?? DEFAULT_CHART_BAR_RADIUS,
    };
  }, [
    axes,
    theme,
    labels,
    animation,
    sparkline,
    timestamps,
    formatLabel,
    orientation,
    merged.radius,
    visibleSeries,
    plotSize.width,
    plotSize.height,
  ]);

  useChartPlot(root, { mount, options });

  const tooltip = useMemo(() => {
    if (isNil(active.index)) {
      return null;
    }

    return getChartCartesianTooltip({
      index: active.index,
      series: visibleSeries,
      title: labels[active.index] ?? "",
    });
  }, [labels, active.index, visibleSeries]);

  const table = useMemo(() => {
    return getChartCartesianTable({
      locale,
      series,
      categories: labels,
      categoryHeader: resolveMessage(isNil(timestamps) ? "Category" : "Date"),
    });
  }, [labels, locale, series, timestamps, resolveMessage]);

  const summary = resolveMessage(
    "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.",
    getChartCartesianSummaryParams({ series, categories: labels }),
  );

  const frame = useChartFrame(root, {
    table,
    tooltip,
    summary,
    count: labels.length,
    isEmpty: isChartEmpty(series.flatMap((item) => item.data)),
  });

  const legendItems = useMemo(() => {
    return toChartLegendItems(series, colors, hidden);
  }, [colors, hidden, series]);

  const context = useChartContextValue(root, {
    tooltip,
    legendItems,
    family: kind,
    setAxis: registry.setAxis,
    removeAxis: registry.removeAxis,
    upsertSeries: registry.upsertSeries,
    removeSeries: registry.removeSeries,
  });

  return {
    frame,
    merged,
    context,
    options,
  };
}
