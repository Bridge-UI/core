// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed } from "vue";

// ** Core Imports
import {
  DEFAULT_CHART_BUBBLE_SIZE,
  DEFAULT_CHART_SYMBOL_SIZE,
  getChartBubbleSizeDomain,
  getChartRangeColorItems,
  getChartScatterPoints,
  getChartScatterTable,
  getChartScatterTooltip,
  isChartScatterEmpty,
  resolveChartRangeColors,
  type ChartScatterRenderOptions,
  type ChartScatterRenderSeries,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartScatterOwnProps } from "@/Components/ChartScatter/chartScatter.types";
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
} from "@/Utils/Charts";
import { mountEchartsScatter } from "@/Utils/Charts/echarts/scatter";

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
  props: ChartScatterOwnProps,
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

  const { merged, hidden, locale, resolveMessage } = root;

  const bubbleSignature = computed(() => {
    return JSON.stringify(
      props.bubbleSize ?? merged.value.bubbleSize ?? DEFAULT_CHART_BUBBLE_SIZE,
    );
  });

  const bubbleSize = computed(() => {
    return JSON.parse(bubbleSignature.value) as [number, number];
  });

  const colors = useChartColors(root, () => {
    return [
      ...registry.entries.value,
      ...getChartRangeColorItems(registry.entries.value),
    ];
  });

  const visibleSeries = computed((): ChartScatterRenderSeries[] => {
    return registry.entries.value
      .filter((item) => !hidden.value.includes(item.id))
      .map((item) => {
        return {
          ...item,
          color: colors.value[item.id] ?? "",
          colorRanges: resolveChartRangeColors({
            seriesId: item.id,
            colors: colors.value,
            ranges: item.colorRanges ?? [],
          }),
        };
      });
  });

  const points = computed(() => {
    return getChartScatterPoints(visibleSeries.value);
  });

  const options = computed((): null | ChartScatterRenderOptions => {
    const theme = root.theme.value;

    if (isNil(theme)) {
      return null;
    }

    return {
      theme,
      points: points.value,
      series: visibleSeries.value,
      bubbleSize: bubbleSize.value,
      animation: root.animation.value,
      width: root.plotSize.value.width,
      height: root.plotSize.value.height,
      xAxis: { ...registry.axes.value.x },
      yAxis: { ...registry.axes.value.y },
      sizeDomain: getChartBubbleSizeDomain(visibleSeries.value),
      symbolSize: merged.value.symbolSize ?? DEFAULT_CHART_SYMBOL_SIZE,
    };
  });

  useChartPlot(root, { options, mount: mountEchartsScatter });

  const labels = computed(() => {
    return {
      size: resolveMessage("Size"),
      x: registry.axes.value.x?.label ?? "x",
      y: registry.axes.value.y?.label ?? "y",
    };
  });

  const tooltip = computed(() => {
    const index = root.active.value.index;
    const point = isNil(index) ? undefined : points.value[index];

    const series = isNil(point)
      ? undefined
      : visibleSeries.value[point.seriesIndex];

    if (isNil(point) || isNil(series)) {
      return null;
    }

    return getChartScatterTooltip({
      point,
      series,
      labels: { ...labels.value, size: series.sizeName ?? labels.value.size },
    });
  });

  const frame = useChartFrame(
    root,
    computed(() => {
      const entries = registry.entries.value;

      return {
        tooltip: tooltip.value,
        count: points.value.length,
        isEmpty: isChartScatterEmpty(entries),
        summary: resolveMessage(
          "Scatter chart with {{count}} series ({{names}}) and {{points}} points.",
          {
            count: entries.length,
            points: getChartScatterPoints(entries).length,
            names: entries.map((item) => item.name).join(", "),
          },
        ),
        table: getChartScatterTable({
          series: entries,
          locale: locale.value,
          headers: {
            x: labels.value.x,
            y: labels.value.y,
            series: resolveMessage("Series"),
            size:
              entries.find((item) => !isNil(item.sizeName))?.sizeName ??
              labels.value.size,
          },
        }),
      };
    }),
  );

  const context = useChartContextValue(
    root,
    computed(() => {
      return {
        tooltip: tooltip.value,
        setAxis: registry.setAxis,
        family: "scatter" as const,
        removeAxis: registry.removeAxis,
        upsertSeries: registry.upsertSeries,
        removeSeries: registry.removeSeries,
        legendItems: toChartLegendItems(
          registry.entries.value,
          colors.value,
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
