// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import {
  computed,
  onBeforeUnmount,
  useAttrs,
  watch,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "vue";

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
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { useChartContext, type ChartLegendItem } from "@/Utils/Chart";

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
  props: ChartLegendOwnProps,
  libDefaults: ChartLegendLibDefaults,
) {
  const attrs = useAttrs();
  const chart = useChartContext();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<ChartLegendProps, typeof chartLegendBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: chartLegendBridgeKeys,
    });
  });

  const { merged, entry: bridgeChartLegend } = useBridgeUIComponent<
    ChartLegendMerged,
    "ChartLegend"
  >({
    libDefaults,
    componentName: "ChartLegend",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChartLegendClasses>({
    entry: bridgeChartLegend,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const interactive = computed(() => {
    return merged.value.interactive !== false;
  });

  const isColumn = computed(() => {
    return (
      merged.value.position === "left" || merged.value.position === "right"
    );
  });

  const items = computed(() => {
    return chart.value.legendItems;
  });

  watch(
    () => merged.value.position,
    (position) => {
      chart.value.setLegendPosition(position);
    },
    { immediate: true },
  );

  onBeforeUnmount(() => {
    chart.value.setLegendPosition(null);
  });

  function getValue(item: ChartLegendItem): null | string {
    if (merged.value.showValue !== true || isNil(item.value)) {
      return null;
    }

    return (
      merged.value.formatValue?.(item.value) ??
      formatChartValue(item.value, chart.value.locale)
    );
  }

  function getPercent(item: ChartLegendItem): null | string {
    if (merged.value.showPercent !== true || isNil(item.value)) {
      return null;
    }

    if (isNil(item.percent)) {
      return "—";
    }

    return (
      merged.value.formatPercent?.(item.percent) ??
      formatChartPercent(item.percent, chart.value.locale)
    );
  }

  const rootBind = computed(() => {
    const position = merged.value.position;

    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      "aria-label": resolveMessage("Legend"),
      class: cn({
        "m-0 flex list-none p-0": true,
        "flex-wrap items-center": !isColumn.value,
        "w-56 max-w-[50%] shrink-0 flex-col": isColumn.value,
        "order-first": position === "top" || position === "left",
        [get(alignClasses, merged.value.align) ?? ""]: true,
        [chart.value.tokenClasses.legend ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    }) as HTMLAttributes;
  });

  function getItemBind(item: ChartLegendItem): ButtonHTMLAttributes {
    const className = cn({
      "inline-flex items-center rounded-md text-dark-700 dark:text-dark-200": true,
      "w-full text-start": isColumn.value,
      "transition-opacity": true,
      "opacity-50": item.hidden,
      "cursor-pointer outline-none hover:bg-dark-100 focus-visible:ring-2 focus-visible:ring-primary-500/50 dark:hover:bg-dark-800":
        interactive.value,
      [chart.value.tokenClasses.legendItem ?? ""]: true,
      [get(mergedClasses.value, "item") ?? ""]: true,
    });

    if (!interactive.value) {
      return mergePartBind(customProps.value?.item, undefined, {
        class: className,
      }) as ButtonHTMLAttributes;
    }

    return mergePartBind(customProps.value?.item, undefined, {
      type: "button",
      class: className,
      "aria-pressed": !item.hidden,
      onBlur: () => {
        chart.value.highlightItem(null);
      },
      onClick: () => {
        chart.value.toggleItem(item.id);
      },
      onFocus: () => {
        chart.value.highlightItem(item.id);
      },
      onMouseleave: () => {
        chart.value.highlightItem(null);
      },
      onMouseenter: () => {
        chart.value.highlightItem(item.id);
      },
    }) as ButtonHTMLAttributes;
  }

  function getSwatchBind(item: ChartLegendItem): HTMLAttributes {
    return {
      "aria-hidden": true,
      style: { backgroundColor: item.color },
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
        truncate: true,
        "min-w-0 flex-1": isColumn.value,
        [get(mergedClasses.value, "label") ?? ""]: true,
      }),
    };
  });

  const valueBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "shrink-0 font-medium tabular-nums": true,
        [get(mergedClasses.value, "value") ?? ""]: true,
      }),
    };
  });

  const percentBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "shrink-0 text-dark-500 tabular-nums dark:text-dark-400": true,
        [get(mergedClasses.value, "percent") ?? ""]: true,
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
