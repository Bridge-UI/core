// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  getChartFunnelPercents,
  getChartFunnelSummaryParams,
  sortChartStages,
  type ChartBaseRenderOptions,
  type ChartFunnelRenderOptions,
  type ChartPartRenderSlice,
  type ChartSliceEntry,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartFunnelOwnProps } from "@/Components/ChartFunnel/chartFunnel.types";
import {
  chartRootBridgeKeys,
  useChartRoot,
  type ChartRootMerged,
} from "@/Utils/Charts";
import { mountEchartsFunnel } from "@/Utils/Charts/echarts/funnel";
import { useChartPart } from "@/Utils/Charts/useChartPart";

const chartFunnelBridgeKeys = [
  ...chartRootBridgeKeys,
  "data",
  "sort",
  "align",
  "labels",
  "labelContent",
] as const satisfies readonly (keyof ChartFunnelOwnProps)[];

const chartFunnelRegistryKeys = [
  "size",
  "sort",
  "align",
  "height",
  "labels",
  "classes",
  "animation",
  "customProps",
] as const satisfies readonly (keyof ChartFunnelOwnProps)[];

type ChartFunnelMerged = ChartRootMerged &
  Pick<ChartFunnelOwnProps, "sort" | "align" | "labels">;

export function useChartFunnel(
  props: ChartFunnelOwnProps,
  libDefaults: Partial<ChartFunnelMerged>,
) {
  const root = useChartRoot<ChartFunnelMerged>({
    props,
    libDefaults,
    componentName: "ChartFunnel",
    bridgeKeys: chartFunnelBridgeKeys,
    registryKeys: chartFunnelRegistryKeys,
  });

  const { merged, locale, resolveMessage } = root;

  const labels = computed(() => {
    return merged.value.labels ?? "inside";
  });

  function order(entries: ChartSliceEntry[]) {
    return sortChartStages(entries, merged.value.sort ?? "descending");
  }

  function buildOptions(
    base: ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] },
  ): ChartFunnelRenderOptions {
    return {
      ...base,
      labels: labels.value,
      align: merged.value.align ?? "center",
    };
  }

  function summary(slices: ChartPartRenderSlice[]) {
    return resolveMessage(
      "Funnel chart with {{count}} stages, from {{first}} ({{firstValue}}) to {{last}} ({{lastValue}}).",
      getChartFunnelSummaryParams({ slices, locale: locale.value }),
    );
  }

  const part = useChartPart(root, {
    order,
    summary,
    buildOptions,
    family: "funnel",
    positiveOnly: false,
    data: () => props.data,
    mount: mountEchartsFunnel,
    labels: () => labels.value,
    percents: getChartFunnelPercents,
    labelContent: () => props.labelContent,
  });

  return {
    ...part,
    merged,
  };
}
