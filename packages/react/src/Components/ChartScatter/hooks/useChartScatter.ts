// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  DEFAULT_CHART_BUBBLE_SIZE,
  DEFAULT_CHART_SYMBOL_SIZE,
  getChartBubbleSizeDomain,
  getChartScatterPoints,
  getChartScatterTable,
  getChartScatterTooltip,
  isChartScatterEmpty,
  type ChartScatterRenderOptions,
  type ChartScatterRenderSeries,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type {
  ChartScatterOwnProps,
  ChartScatterProps,
} from "@/Components/ChartScatter/chartScatter.types";
import {
  chartRootBridgeKeys,
  toChartLegendItems,
  useChartColors,
  useChartContextValue,
  useChartFrame,
  useChartPlot,
  useChartRegistry,
  useChartRoot,
  type ChartRootMerged,
  type ChartScatterSeriesRegistration,
} from "@/Utils/Chart";
import { mountEchartsScatter } from "@/Utils/Chart/echarts/scatter";

const chartScatterBridgeKeys = [
  ...chartRootBridgeKeys,
  "bubbleSize",
  "symbolSize",
] as const satisfies readonly (keyof ChartScatterOwnProps)[];

const chartScatterRegistryKeys = [
  "size",
  "height",
  "classes",
  "animation",
  "symbolSize",
  "customProps",
] as const satisfies readonly (keyof ChartScatterOwnProps)[];

type ChartScatterMerged = ChartRootMerged &
  Pick<ChartScatterOwnProps, "bubbleSize" | "symbolSize">;

export function useChartScatter(
  props: ChartScatterProps,
  libDefaults: Partial<ChartScatterMerged>,
) {
  const root = useChartRoot<ChartScatterMerged>({
    props,
    libDefaults,
    componentName: "ChartScatter",
    bridgeKeys: chartScatterBridgeKeys,
    registryKeys: chartScatterRegistryKeys,
  });

  const registry = useChartRegistry<ChartScatterSeriesRegistration>();

  const { theme, merged, hidden, locale, active, plotSize, animation } = root;
  const { resolveMessage } = root;

  const bubbleSignature = JSON.stringify(
    props.bubbleSize ?? merged.bubbleSize ?? DEFAULT_CHART_BUBBLE_SIZE,
  );

  const bubbleSize = useMemo(() => {
    return JSON.parse(bubbleSignature) as [number, number];
  }, [bubbleSignature]);

  const colors = useChartColors(root, registry.entries);

  const visibleSeries = useMemo((): ChartScatterRenderSeries[] => {
    return registry.entries
      .filter((item) => !hidden.includes(item.id))
      .map((item) => ({ ...item, color: colors[item.id] ?? "" }));
  }, [registry.entries, hidden, colors]);

  const points = useMemo(() => {
    return getChartScatterPoints(visibleSeries);
  }, [visibleSeries]);

  const options = useMemo((): null | ChartScatterRenderOptions => {
    if (isNil(theme)) {
      return null;
    }

    return {
      theme,
      points,
      animation,
      bubbleSize,
      series: visibleSeries,
      width: plotSize.width,
      height: plotSize.height,
      xAxis: { ...registry.axes.x },
      yAxis: { ...registry.axes.y },
      sizeDomain: getChartBubbleSizeDomain(visibleSeries),
      symbolSize: merged.symbolSize ?? DEFAULT_CHART_SYMBOL_SIZE,
    };
  }, [
    theme,
    points,
    animation,
    bubbleSize,
    visibleSeries,
    registry.axes,
    plotSize.width,
    plotSize.height,
    merged.symbolSize,
  ]);

  useChartPlot(root, { options, mount: mountEchartsScatter });

  const xLabel = registry.axes.x?.label ?? "x";
  const yLabel = registry.axes.y?.label ?? "y";
  const sizeLabel = resolveMessage("Size");

  const tooltip = useMemo(() => {
    const point = isNil(active.index) ? undefined : points[active.index];
    const series = isNil(point) ? undefined : visibleSeries[point.seriesIndex];

    if (isNil(point) || isNil(series)) {
      return null;
    }

    return getChartScatterTooltip({
      point,
      series,
      labels: { x: xLabel, y: yLabel, size: series.sizeName ?? sizeLabel },
    });
  }, [active.index, points, visibleSeries, xLabel, yLabel, sizeLabel]);

  const table = getChartScatterTable({
    locale,
    series: registry.entries,
    headers: {
      x: xLabel,
      y: yLabel,
      series: resolveMessage("Series"),
      size:
        registry.entries.find((item) => !isNil(item.sizeName))?.sizeName ??
        sizeLabel,
    },
  });

  const summary = resolveMessage(
    "Scatter chart with {{count}} series ({{names}}) and {{points}} points.",
    {
      count: registry.entries.length,
      points: getChartScatterPoints(registry.entries).length,
      names: registry.entries.map((item) => item.name).join(", "),
    },
  );

  const frame = useChartFrame(root, {
    table,
    tooltip,
    summary,
    count: points.length,
    isEmpty: isChartScatterEmpty(registry.entries),
  });

  const legendItems = useMemo(() => {
    return toChartLegendItems(registry.entries, colors, hidden);
  }, [registry.entries, colors, hidden]);

  const context = useChartContextValue(root, {
    tooltip,
    legendItems,
    family: "scatter",
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
