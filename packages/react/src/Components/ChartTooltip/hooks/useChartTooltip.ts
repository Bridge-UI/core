// ** External Imports
import { get, isEqual, isNil } from "es-toolkit/compat";
import {
  useCallback,
  useLayoutEffect,
  useState,
  type HTMLAttributes,
} from "react";

// ** Core Imports
import {
  formatChartPercent,
  formatChartValue,
  resolveChartTooltipPosition,
  type ChartTooltipItem,
  type ChartTooltipPosition,
} from "@bridge-ui/core/Domain";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ChartTooltipClasses,
  ChartTooltipContentContext,
  ChartTooltipOwnProps,
  ChartTooltipProps,
} from "@/Components/ChartTooltip/chartTooltip.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { useChartContext } from "@/Utils/Charts";

const chartTooltipBridgeKeys = [
  "slots",
  "classes",
  "customProps",
  "formatValue",
  "formatPercent",
] as const satisfies readonly (keyof ChartTooltipOwnProps)[];

export function useChartTooltip(props: ChartTooltipProps) {
  const chart = useChartContext();

  const [tooltipEl, setTooltipEl] = useState<null | HTMLDivElement>(null);

  const [position, setPosition] = useState<null | ChartTooltipPosition>(null);

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ChartTooltipProps,
    typeof chartTooltipBridgeKeys
  >({
    props,
    bridgeKeys: chartTooltipBridgeKeys,
  });

  const { merged, entry: bridgeChartTooltip } = useBridgeUIComponent<
    ChartTooltipOwnProps,
    "ChartTooltip"
  >({
    props: componentProps,
    componentName: "ChartTooltip",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChartTooltipClasses>({
    props: componentProps,
    entry: bridgeChartTooltip,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return componentProps.slots;
  });

  const { tooltip, getBounds, activeIndex, getTooltipAnchor } = chart;

  const isOpen = derived(() => {
    return !isNil(activeIndex) && !isNil(tooltip) && tooltip.items.length > 0;
  });

  useLayoutEffect(() => {
    if (!isOpen || isNil(tooltipEl) || isNil(activeIndex)) {
      return;
    }

    const anchor = getTooltipAnchor(activeIndex);

    const next = isNil(anchor)
      ? null
      : resolveChartTooltipPosition({
          anchor,
          bounds: getBounds(),
          size: {
            width: tooltipEl.offsetWidth,
            height: tooltipEl.offsetHeight,
          },
        });

    setPosition((previous) => {
      return isEqual(previous, next) ? previous : next;
    });
  }, [isOpen, tooltip, getBounds, tooltipEl, activeIndex, getTooltipAnchor]);

  const context = derived((): null | ChartTooltipContentContext => {
    if (isNil(activeIndex) || isNil(tooltip)) {
      return null;
    }

    return {
      index: activeIndex,
      color: tooltip.color,
      title: tooltip.title,
      items: tooltip.items,
    };
  });

  const formatValue = useCallback(
    (item: ChartTooltipItem) => {
      return (
        merged.formatValue?.(item.value, item) ??
        formatChartValue(item.value, chart.locale)
      );
    },
    [chart.locale, merged.formatValue],
  );

  const formatPercent = useCallback(
    (item: ChartTooltipItem) => {
      if (isNil(item.percent)) {
        return null;
      }

      return (
        merged.formatPercent?.(item.percent, item) ??
        formatChartPercent(item.percent, chart.locale)
      );
    },
    [chart.locale, merged.formatPercent],
  );

  const rootBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return mergePartBind(customProps?.root, inheritedAttrs, {
      ref: setTooltipEl,
      "aria-hidden": true,
      style: {
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: isNil(position) ? "hidden" : "visible",
      },
      className: cn({
        "pointer-events-none absolute z-20 flex min-w-32 flex-col": true,
        "rounded-md border border-dark-200 bg-white text-dark-700 shadow-lg": true,
        "dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100": true,
        [chart.tokenClasses.tooltip ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    }) as HTMLAttributes<HTMLDivElement>;
  });

  const titleBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: cn({
        "flex items-center gap-2 font-semibold": true,
        [get(mergedClasses, "title") ?? ""]: true,
      }),
    };
  });

  const itemBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: cn({
        "flex items-center gap-2": true,
        [get(mergedClasses, "item") ?? ""]: true,
      }),
    };
  });

  const getSwatchBind = useCallback(
    (color: string): HTMLAttributes<HTMLSpanElement> => {
      return {
        style: { backgroundColor: color },
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
        "flex-1 text-dark-500 dark:text-dark-400": true,
        [get(mergedClasses, "label") ?? ""]: true,
      }),
    };
  });

  const percentBind = derived((): HTMLAttributes<HTMLSpanElement> => {
    return {
      className: cn({
        "text-dark-500 tabular-nums dark:text-dark-400": true,
        [get(mergedClasses, "percent") ?? ""]: true,
      }),
    };
  });

  const valueBind = derived((): HTMLAttributes<HTMLSpanElement> => {
    return {
      className: cn({
        "font-medium tabular-nums": true,
        [get(mergedClasses, "value") ?? ""]: true,
      }),
    };
  });

  return {
    slots,
    isOpen,
    merged,
    context,
    itemBind,
    rootBind,
    labelBind,
    titleBind,
    valueBind,
    percentBind,
    formatValue,
    formatPercent,
    getSwatchBind,
  };
}
