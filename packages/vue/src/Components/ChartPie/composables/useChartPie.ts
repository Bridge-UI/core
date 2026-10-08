// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  DEFAULT_CHART_DONUT_THICKNESS,
  DEFAULT_CHART_MIN_ANGLE,
  getChartPiePercents,
  getChartPieSummaryParams,
  type ChartBaseRenderOptions,
  type ChartPartRenderSlice,
  type ChartPieRenderOptions,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { ChartPieOwnProps } from "@/Components/ChartPie/chartPie.types";
import {
  chartRootBridgeKeys,
  useChartRoot,
  type ChartRootMerged,
} from "@/Utils/Charts";
import { mountEchartsPie } from "@/Utils/Charts/echarts/pie";
import { useChartPart } from "@/Utils/Charts/useChartPart";

const chartPieBridgeKeys = [
  ...chartRootBridgeKeys,
  "data",
  "labels",
  "variant",
  "minAngle",
  "maxSlices",
  "thickness",
  "labelContent",
] as const satisfies readonly (keyof ChartPieOwnProps)[];

const chartPieRegistryKeys = [
  "size",
  "height",
  "labels",
  "classes",
  "variant",
  "minAngle",
  "animation",
  "thickness",
  "customProps",
] as const satisfies readonly (keyof ChartPieOwnProps)[];

type ChartPieMerged = ChartRootMerged &
  Pick<ChartPieOwnProps, "labels" | "variant" | "minAngle" | "thickness">;

export function useChartPie(
  props: ChartPieOwnProps,
  libDefaults: Partial<ChartPieMerged>,
) {
  const root = useChartRoot<ChartPieMerged>({
    props,
    libDefaults,
    componentName: "ChartPie",
    bridgeKeys: chartPieBridgeKeys,
    registryKeys: chartPieRegistryKeys,
  });

  const { merged, locale, resolveMessage } = root;

  const variant = computed(() => {
    return merged.value.variant ?? "pie";
  });

  const labels = computed(() => {
    return merged.value.labels ?? false;
  });

  function buildOptions(
    base: ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] },
  ): ChartPieRenderOptions {
    return {
      ...base,
      labels: labels.value,
      variant: variant.value,
      minAngle: merged.value.minAngle ?? DEFAULT_CHART_MIN_ANGLE,
      thickness: merged.value.thickness ?? DEFAULT_CHART_DONUT_THICKNESS,
    };
  }

  function summary(slices: ChartPartRenderSlice[]) {
    return resolveMessage(
      "Pie chart with {{count}} slices: {{items}}.",
      getChartPieSummaryParams({ slices, locale: locale.value }),
    );
  }

  const part = useChartPart(root, {
    summary,
    buildOptions,
    family: "pie",
    positiveOnly: true,
    mount: mountEchartsPie,
    data: () => props.data,
    labels: () => labels.value,
    percents: getChartPiePercents,
    maxSlices: () => props.maxSlices,
    labelContent: () => props.labelContent,
  });

  return {
    ...part,
    merged,
    variant,
  };
}
