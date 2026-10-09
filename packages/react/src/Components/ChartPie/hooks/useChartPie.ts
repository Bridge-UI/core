// ** External Imports
import { useCallback } from "react";

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
import type {
  ChartPieOwnProps,
  ChartPieProps,
} from "@/Components/ChartPie/chartPie.types";
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
  props: ChartPieProps,
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

  const labels = merged.labels ?? false;
  const labelPosition = merged.labelPosition ?? "outside";
  const variant = merged.variant ?? "pie";
  const minAngle = merged.minAngle ?? DEFAULT_CHART_MIN_ANGLE;
  const thickness = merged.thickness ?? DEFAULT_CHART_DONUT_THICKNESS;
  const rose = merged.rose ?? null;
  const sliceDefaults = getChartPieSliceDefaults(variant);
  const padAngle = merged.padAngle ?? sliceDefaults.padAngle;
  const cornerRadius = merged.cornerRadius ?? sliceDefaults.cornerRadius;

  const buildOptions = useCallback(
    (
      base: ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] },
    ): ChartPieRenderOptions => {
      return {
        ...base,
        rose,
        labels,
        variant,
        minAngle,
        padAngle,
        thickness,
        cornerRadius,
        labelPosition,
      };
    },
    [
      rose,
      labels,
      variant,
      minAngle,
      padAngle,
      thickness,
      cornerRadius,
      labelPosition,
    ],
  );

  const summary = (slices: ChartPartRenderSlice[]) => {
    return resolveMessage(
      "Pie chart with {{count}} slices: {{items}}.",
      getChartPieSummaryParams({ slices, locale }),
    );
  };

  const part = useChartPart(root, {
    labels,
    summary,
    buildOptions,
    family: "pie",
    data: props.data,
    positiveOnly: true,
    mount: mountEchartsPie,
    maxSlices: props.maxSlices,
    percents: getChartPiePercents,
    labelContent: props.labelContent,
  });

  return {
    ...part,
    merged,
    variant,
    center: props.slots?.center,
  };
}
