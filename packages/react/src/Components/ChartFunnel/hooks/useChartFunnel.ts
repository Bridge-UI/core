// ** External Imports
import { useCallback } from "react";

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
import type {
  ChartFunnelOwnProps,
  ChartFunnelProps,
} from "@/Components/ChartFunnel/chartFunnel.types";
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
  props: ChartFunnelProps,
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

  const sort = merged.sort ?? "descending";
  const align = merged.align ?? "center";
  const labels = merged.labels ?? "inside";

  const order = useCallback(
    (entries: ChartSliceEntry[]) => sortChartStages(entries, sort),
    [sort],
  );

  const buildOptions = useCallback(
    (
      base: ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] },
    ): ChartFunnelRenderOptions => {
      return { ...base, align, labels };
    },
    [align, labels],
  );

  const summary = (slices: ChartPartRenderSlice[]) => {
    return resolveMessage(
      "Funnel chart with {{count}} stages, from {{first}} ({{firstValue}}) to {{last}} ({{lastValue}}).",
      getChartFunnelSummaryParams({ slices, locale }),
    );
  };

  const part = useChartPart(root, {
    order,
    labels,
    summary,
    buildOptions,
    family: "funnel",
    data: props.data,
    positiveOnly: false,
    mount: mountEchartsFunnel,
    labelContent: props.labelContent,
    percents: getChartFunnelPercents,
  });

  return {
    ...part,
    merged,
  };
}
