// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import {
  useCallback,
  useLayoutEffect,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

// ** Core Imports
import { formatChartPercent, formatChartValue } from "@bridge-ui/core/Domain";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
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
import { useChartContext, type ChartLegendItem } from "@/Utils/Charts";

const chartLegendBridgeKeys = [
  "align",
  "classes",
  "position",
  "showValue",
  "customProps",
  "formatValue",
  "interactive",
  "showPercent",
  "formatPercent",
] as const satisfies readonly (keyof ChartLegendOwnProps)[];

type ChartLegendLibDefaults = LibDefaultsShape<
  ChartLegendOwnProps,
  "align" | "position" | "showValue" | "interactive" | "showPercent"
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

  const isColumn = merged.position === "left" || merged.position === "right";

  const items = derived(() => {
    return chart.legendItems;
  });

  const { locale, toggleItem, highlightItem, setLegendPosition } = chart;

  const position = merged.position;

  useLayoutEffect(() => {
    setLegendPosition(position);

    return () => {
      setLegendPosition(null);
    };
  }, [position, setLegendPosition]);

  const formatValueProp = merged.formatValue;
  const formatPercentProp = merged.formatPercent;

  const getValue = useCallback(
    (item: ChartLegendItem): null | string => {
      if (merged.showValue !== true || isNil(item.value)) {
        return null;
      }

      return (
        formatValueProp?.(item.value) ?? formatChartValue(item.value, locale)
      );
    },
    [locale, formatValueProp, merged.showValue],
  );

  const getPercent = useCallback(
    (item: ChartLegendItem): null | string => {
      if (merged.showPercent !== true || isNil(item.value)) {
        return null;
      }

      if (isNil(item.percent)) {
        return "—";
      }

      return (
        formatPercentProp?.(item.percent) ??
        formatChartPercent(item.percent, locale)
      );
    },
    [locale, formatPercentProp, merged.showPercent],
  );

  const rootBind = derived((): HTMLAttributes<HTMLUListElement> => {
    return mergePartBind(customProps?.root, inheritedAttrs, {
      "aria-label": resolveMessage("Legend"),
      className: cn({
        "m-0 flex list-none p-0": true,
        "flex-wrap items-center": !isColumn,
        "w-56 max-w-[50%] shrink-0 flex-col": isColumn,
        "order-first": position === "top" || position === "left",
        [get(alignClasses, merged.align) ?? ""]: true,
        [chart.tokenClasses.legend ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const getItemBind = useCallback(
    (item: ChartLegendItem): ButtonHTMLAttributes<HTMLButtonElement> => {
      const className = cn({
        "inline-flex items-center rounded-md text-dark-700 dark:text-dark-200": true,
        "w-full text-start": isColumn,
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
          highlightItem(null);
        },
        onClick: () => {
          toggleItem(item.id);
        },
        onFocus: () => {
          highlightItem(item.id);
        },
        onMouseLeave: () => {
          highlightItem(null);
        },
        onMouseEnter: () => {
          highlightItem(item.id);
        },
      });
    },
    [
      isColumn,
      interactive,
      toggleItem,
      mergedClasses,
      highlightItem,
      customProps?.item,
      chart.tokenClasses.legendItem,
    ],
  );

  const getSwatchBind = useCallback(
    (item: ChartLegendItem): HTMLAttributes<HTMLSpanElement> => {
      return {
        "aria-hidden": true,
        style: { backgroundColor: item.color },
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
        "min-w-0 flex-1": isColumn,
        [get(mergedClasses, "label") ?? ""]: true,
      }),
    };
  });

  const valueBind = derived((): HTMLAttributes<HTMLSpanElement> => {
    return {
      className: cn({
        "shrink-0 font-medium tabular-nums": true,
        [get(mergedClasses, "value") ?? ""]: true,
      }),
    };
  });

  const percentBind = derived((): HTMLAttributes<HTMLSpanElement> => {
    return {
      className: cn({
        "shrink-0 text-dark-500 tabular-nums dark:text-dark-400": true,
        [get(mergedClasses, "percent") ?? ""]: true,
      }),
    };
  });

  return {
    items,
    merged,
    rootBind,
    getValue,
    labelBind,
    valueBind,
    getPercent,
    interactive,
    percentBind,
    getItemBind,
    getSwatchBind,
  };
}
