// ** External Imports
import { computed } from "vue";

// ** Core Imports
import {
  DEFAULT_CHART_DONUT_THICKNESS,
  DEFAULT_CHART_MIN_ANGLE,
  getChartPiePercents,
  getChartPieSliceDefaults,
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
  "rose",
  "labels",
  "variant",
  "minAngle",
  "padAngle",
  "maxSlices",
  "thickness",
  "cornerRadius",
  "labelContent",
  "labelPosition",
] as const satisfies readonly (keyof ChartPieOwnProps)[];

const chartPieRegistryKeys = [
  "rose",
  "size",
  "height",
  "labels",
  "classes",
  "variant",
  "minAngle",
  "padAngle",
  "animation",
  "thickness",
  "customProps",
  "cornerRadius",
  "labelPosition",
] as const satisfies readonly (keyof ChartPieOwnProps)[];

type ChartPieMerged = ChartRootMerged &
  Pick<
    ChartPieOwnProps,
    | "rose"
    | "labels"
    | "variant"
    | "minAngle"
    | "padAngle"
    | "thickness"
    | "cornerRadius"
    | "labelPosition"
  >;

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
    const sliceDefaults = getChartPieSliceDefaults(variant.value);

    return {
      ...base,
      labels: labels.value,
      variant: variant.value,
      rose: merged.value.rose ?? null,
      labelPosition: merged.value.labelPosition ?? "outside",
      padAngle: merged.value.padAngle ?? sliceDefaults.padAngle,
      minAngle: merged.value.minAngle ?? DEFAULT_CHART_MIN_ANGLE,
      thickness: merged.value.thickness ?? DEFAULT_CHART_DONUT_THICKNESS,
      cornerRadius: merged.value.cornerRadius ?? sliceDefaults.cornerRadius,
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
