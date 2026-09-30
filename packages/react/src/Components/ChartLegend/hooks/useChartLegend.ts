// ** External Imports
import { get } from "es-toolkit/compat";
import {
  useCallback,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

// ** Core Imports
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import {
  useChartContext,
  type ChartResolvedSeries,
} from "@/Components/Chart/ChartContext";
import type {
  ChartLegendClasses,
  ChartLegendOwnProps,
  ChartLegendProps,
} from "@/Components/ChartLegend/chartLegend.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const chartLegendBridgeKeys = [
  "align",
  "classes",
  "position",
  "customProps",
  "interactive",
] as const satisfies readonly (keyof ChartLegendOwnProps)[];

type ChartLegendLibDefaults = LibDefaultsShape<
  ChartLegendOwnProps,
  "align" | "position" | "interactive"
>;

type ChartLegendMerged = MergeLibDefaults<
  ChartLegendOwnProps,
  ChartLegendLibDefaults
>;

const alignClasses = {
  end: "justify-end",
  start: "justify-start",
  center: "justify-center",
} as const;

export function useChartLegend(
  props: ChartLegendProps,
  libDefaults: ChartLegendLibDefaults,
) {
  const chart = useChartContext();
  const resolveMessage = useResolveMessage();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ChartLegendProps,
    typeof chartLegendBridgeKeys
  >({
    props,
    bridgeKeys: chartLegendBridgeKeys,
  });

  const { merged, entry: bridgeChartLegend } = useBridgeUIComponent<
    ChartLegendMerged,
    "ChartLegend"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ChartLegend",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChartLegendClasses>({
    props: componentProps,
    entry: bridgeChartLegend,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const interactive = derived(() => {
    return merged.interactive !== false;
  });

  const items = derived(() => {
    return chart.series;
  });

  const { toggleSeries, highlightSeries } = chart;

  const rootBind = derived((): HTMLAttributes<HTMLUListElement> => {
    return mergePartBind(customProps?.root, inheritedAttrs, {
      "aria-label": resolveMessage("Legend"),
      className: cn({
        "m-0 flex list-none flex-wrap items-center p-0": true,
        "order-first": merged.position === "top",
        [get(alignClasses, merged.align) ?? ""]: true,
        [chart.tokenClasses.legend ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const getItemBind = useCallback(
    (item: ChartResolvedSeries): ButtonHTMLAttributes<HTMLButtonElement> => {
      const className = cn({
        "inline-flex items-center rounded-md text-dark-700 dark:text-dark-200": true,
        "transition-opacity": true,
        "opacity-50": item.hidden,
        "cursor-pointer outline-none hover:bg-dark-100 focus-visible:ring-2 focus-visible:ring-primary-500/50 dark:hover:bg-dark-800":
          interactive,
        [chart.tokenClasses.legendItem ?? ""]: true,
        [get(mergedClasses, "item") ?? ""]: true,
      });

      if (!interactive) {
        return mergePartBind(customProps?.item, undefined, { className });
      }

      return mergePartBind(customProps?.item, undefined, {
        className,
        type: "button",
        "aria-pressed": !item.hidden,
        onBlur: () => {
          highlightSeries(null);
        },
        onClick: () => {
          toggleSeries(item.id);
        },
        onFocus: () => {
          highlightSeries(item.id);
        },
        onMouseLeave: () => {
          highlightSeries(null);
        },
        onMouseEnter: () => {
          highlightSeries(item.id);
        },
      });
    },
    [
      interactive,
      toggleSeries,
      mergedClasses,
      highlightSeries,
      customProps?.item,
      chart.tokenClasses.legendItem,
    ],
  );

  const getSwatchBind = useCallback(
    (item: ChartResolvedSeries): HTMLAttributes<HTMLSpanElement> => {
      return {
        "aria-hidden": true,
        style: { backgroundColor: item.resolvedColor },
        className: cn({
          "shrink-0 rounded-full": true,
          [chart.tokenClasses.swatch ?? ""]: true,
          [get(mergedClasses, "swatch") ?? ""]: true,
        }),
      };
    },
    [mergedClasses, chart.tokenClasses.swatch],
  );

  const labelBind = derived((): HTMLAttributes<HTMLSpanElement> => {
    return {
      className: cn({
        truncate: true,
        [get(mergedClasses, "label") ?? ""]: true,
      }),
    };
  });

  return {
    items,
    merged,
    rootBind,
    labelBind,
    interactive,
    getItemBind,
    getSwatchBind,
  };
}
