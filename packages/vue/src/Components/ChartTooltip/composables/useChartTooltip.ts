// ** External Imports
import { get, isEqual, isNil } from "es-toolkit/compat";
import {
  computed,
  shallowRef,
  useAttrs,
  watch,
  type HTMLAttributes,
  type Ref,
} from "vue";

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
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { useChartContext } from "@/Utils/Charts";

const chartTooltipBridgeKeys = [
  "classes",
  "customProps",
  "formatValue",
  "formatPercent",
] as const satisfies readonly (keyof ChartTooltipOwnProps)[];

export function useChartTooltip(
  props: ChartTooltipOwnProps,
  tooltipRef: Readonly<Ref<null | HTMLDivElement>>,
) {
  const attrs = useAttrs();
  const chart = useChartContext();

  const position = shallowRef<null | ChartTooltipPosition>(null);

  const split = computed(() => {
    return splitComponentProps<
      ChartTooltipProps,
      typeof chartTooltipBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: chartTooltipBridgeKeys,
    });
  });

  const { merged, entry: bridgeChartTooltip } = useBridgeUIComponent<
    ChartTooltipOwnProps,
    "ChartTooltip"
  >({
    componentName: "ChartTooltip",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChartTooltipClasses>({
    entry: bridgeChartTooltip,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const isOpen = computed(() => {
    const tooltip = chart.value.tooltip;

    return (
      !isNil(chart.value.activeIndex) &&
      !isNil(tooltip) &&
      tooltip.items.length > 0
    );
  });

  watch(
    [
      isOpen,
      tooltipRef,
      () => chart.value.activeIndex,
      () => chart.value.tooltip,
    ],
    () => {
      const tooltipEl = tooltipRef.value;
      const activeIndex = chart.value.activeIndex;

      if (!isOpen.value || isNil(tooltipEl) || isNil(activeIndex)) {
        return;
      }

      const anchor = chart.value.getTooltipAnchor(activeIndex);

      const next = isNil(anchor)
        ? null
        : resolveChartTooltipPosition({
            anchor,
            bounds: chart.value.getBounds(),
            size: {
              width: tooltipEl.offsetWidth,
              height: tooltipEl.offsetHeight,
            },
          });

      if (!isEqual(position.value, next)) {
        position.value = next;
      }
    },
    { flush: "post", immediate: true },
  );

  const context = computed((): null | ChartTooltipContentContext => {
    const index = chart.value.activeIndex;
    const tooltip = chart.value.tooltip;

    if (isNil(index) || isNil(tooltip)) {
      return null;
    }

    return {
      index,
      color: tooltip.color,
      title: tooltip.title,
      items: tooltip.items,
    };
  });

  function formatValue(item: ChartTooltipItem) {
    return (
      merged.value.formatValue?.(item.value, item) ??
      formatChartValue(item.value, chart.value.locale)
    );
  }

  function formatPercent(item: ChartTooltipItem) {
    if (isNil(item.percent)) {
      return null;
    }

    return (
      merged.value.formatPercent?.(item.percent, item) ??
      formatChartPercent(item.percent, chart.value.locale)
    );
  }

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      "aria-hidden": true,
      style: {
        top: `${position.value?.top ?? 0}px`,
        left: `${position.value?.left ?? 0}px`,
        visibility: isNil(position.value) ? "hidden" : "visible",
      },
      class: cn({
        "pointer-events-none absolute z-20 flex min-w-32 flex-col": true,
        "rounded-md border border-dark-200 bg-white text-dark-700 shadow-lg": true,
        "dark:border-dark-700 dark:bg-dark-800 dark:text-dark-100": true,
        [chart.value.tokenClasses.tooltip ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    }) as HTMLAttributes;
  });

  const titleBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "flex items-center gap-2 font-semibold": true,
        [get(mergedClasses.value, "title") ?? ""]: true,
      }),
    };
  });

  const itemBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "flex items-center gap-2": true,
        [get(mergedClasses.value, "item") ?? ""]: true,
      }),
    };
  });

  function getSwatchBind(color: string): HTMLAttributes {
    return {
      style: { backgroundColor: color },
      class: cn({
        "shrink-0 rounded-full": true,
        [chart.value.tokenClasses.swatch ?? ""]: true,
        [get(mergedClasses.value, "swatch") ?? ""]: true,
      }),
    };
  }

  const labelBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "flex-1 text-dark-500 dark:text-dark-400": true,
        [get(mergedClasses.value, "label") ?? ""]: true,
      }),
    };
  });

  const percentBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "text-dark-500 tabular-nums dark:text-dark-400": true,
        [get(mergedClasses.value, "percent") ?? ""]: true,
      }),
    };
  });

  const noteBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "text-dark-500 dark:text-dark-400": true,
        [get(mergedClasses.value, "note") ?? ""]: true,
      }),
    };
  });

  const valueBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "font-medium tabular-nums": true,
        [get(mergedClasses.value, "value") ?? ""]: true,
      }),
    };
  });

  return {
    isOpen,
    merged,
    context,
    itemBind,
    noteBind,
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
