// ** External Imports
import { get } from "es-toolkit/compat";
import {
  computed,
  useAttrs,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "vue";

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
} from "@/Components/Chart/chartInjectionKey";
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

  const items = computed(() => {
    return chart.value.series;
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      "aria-label": resolveMessage("Legend"),
      class: cn({
        "m-0 flex list-none flex-wrap items-center p-0": true,
        "order-first": merged.value.position === "top",
        [get(alignClasses, merged.value.align) ?? ""]: true,
        [chart.value.tokenClasses.legend ?? ""]: true,
        [get(mergedClasses.value, "root") ?? ""]: true,
      }),
    }) as HTMLAttributes;
  });

  function getItemBind(item: ChartResolvedSeries): ButtonHTMLAttributes {
    const className = cn({
      "inline-flex items-center rounded-md text-dark-700 dark:text-dark-200": true,
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
        chart.value.highlightSeries(null);
      },
      onClick: () => {
        chart.value.toggleSeries(item.id);
      },
      onFocus: () => {
        chart.value.highlightSeries(item.id);
      },
      onMouseleave: () => {
        chart.value.highlightSeries(null);
      },
      onMouseenter: () => {
        chart.value.highlightSeries(item.id);
      },
    }) as ButtonHTMLAttributes;
  }

  function getSwatchBind(item: ChartResolvedSeries): HTMLAttributes {
    return {
      "aria-hidden": true,
      style: { backgroundColor: item.resolvedColor },
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
        [get(mergedClasses.value, "label") ?? ""]: true,
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
