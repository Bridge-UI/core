// ** External Imports
import { get, isEqual, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useAttrs,
  useId,
  watch,
  type HTMLAttributes,
  type Ref,
} from "vue";

// ** Core Imports
import {
  DEFAULT_CHART_HEIGHT,
  DEFAULT_CHART_PALETTE,
  DEFAULT_CHART_X_AXIS,
  DEFAULT_CHART_Y_AXIS,
  formatChartAnnouncement,
  formatChartValue,
  getAdjacentChartIndex,
  getChartSummaryParams,
  getChartTableRows,
  getChartTooltipItems,
  isChartEmpty,
  isSameChartAxisOptions,
  isSameChartSeriesEntry,
  resolveChartSeriesColor,
  toChartCssSize,
  type ChartAxisPosition,
  type ChartHandle,
  type ChartRenderAxis,
  type ChartRenderOptions,
  type ChartRenderTheme,
  type ChartSeriesEntry,
} from "@bridge-ui/core/Domain";
import {
  observeColorScheme,
  prefersReducedMotion,
  readChartTheme,
  readCssColor,
} from "@bridge-ui/core/Runtime";
import {
  chartColorProps as colorProps,
  chartSizeProps as sizeProps,
  chartThemeProps as themeProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  ChartClasses,
  ChartOwnProps,
  ChartProps,
} from "@/Components/Chart/chart.types";
import {
  CHART_INJECTION_KEY,
  type ChartContextValue,
  type ChartResolvedSeries,
} from "@/Components/Chart/chartInjectionKey";
import { mountEchartsChart } from "@/Components/Chart/echartsChart";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const chartBridgeKeys = [
  "size",
  "width",
  "height",
  "classes",
  "loading",
  "palette",
  "summary",
  "animation",
  "categories",
  "customProps",
] as const satisfies readonly (keyof ChartOwnProps)[];

type ChartRegistryProps = Pick<
  ChartOwnProps,
  "size" | "height" | "classes" | "palette" | "animation" | "customProps"
>;

type ChartLibDefaults = LibDefaultsShape<
  ChartOwnProps,
  "size" | "height" | "animation"
>;

type ChartMerged = MergeLibDefaults<ChartRegistryProps, ChartLibDefaults>;

type ChartActive = {
  index: null | number;
  source: "pointer" | "keyboard";
};

type ChartElementRef = Readonly<Ref<null | HTMLDivElement>>;

export function useChart(
  props: ChartOwnProps,
  libDefaults: ChartLibDefaults,
  elements: {
    hostRef: ChartElementRef;
    plotRef: ChartElementRef;
    rootRef: ChartElementRef;
  },
) {
  const vueId = useId();
  const attrs = useAttrs();
  const chartId = `bridge-chart${vueId}`;

  const resolveMessage = useResolveMessage();

  const { hostRef, plotRef, rootRef } = elements;

  const handleRef = shallowRef<null | ChartHandle>(null);

  let hostNode: null | HTMLDivElement = null;
  let renderedOptions: null | ChartRenderOptions = null;

  const schemeTick = ref(0);
  const hiddenSeries = ref<string[]>([]);
  const entries = ref<ChartSeriesEntry[]>([]);
  const plotSize = shallowRef({ width: 0, height: 0 });
  const colors = shallowRef<Record<string, string>>({});
  const theme = shallowRef<null | ChartRenderTheme>(null);

  const active = shallowRef<ChartActive>({
    index: null,
    source: "pointer",
  });

  const axes = shallowRef<
    Partial<Record<ChartAxisPosition, Partial<ChartRenderAxis>>>
  >({});

  const split = computed(() => {
    return splitComponentProps<ChartProps, typeof chartBridgeKeys>({
      bridgeKeys: chartBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const componentProps = computed(() => {
    return split.value.componentProps;
  });

  const {
    bridge,
    merged,
    entry: bridgeChart,
  } = useBridgeUIComponent<ChartMerged, "Chart">({
    libDefaults,
    componentName: "Chart",
    props: () => omit(componentProps.value, ["palette", "categories"]),
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChartClasses>({
    entry: bridgeChart,
    props: () => componentProps.value,
  });

  const locale = computed(() => {
    return bridge?.global.value.locale ?? "en-US";
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const categoriesSignature = computed(() => {
    return JSON.stringify(componentProps.value.categories ?? []);
  });

  const categories = computed(() => {
    return JSON.parse(categoriesSignature.value) as string[];
  });

  const paletteSignature = computed(() => {
    return JSON.stringify(
      componentProps.value.palette ??
        merged.value.palette ??
        DEFAULT_CHART_PALETTE,
    );
  });

  const palette = computed(() => {
    return JSON.parse(paletteSignature.value) as string[];
  });

  const sizeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeChart.value?.tokens?.size,
    );
  });

  const colorClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeChart.value?.tokens?.color,
    );
  });

  const themeClasses = computed(() => {
    return mergeBridgeUILayeredClasses(
      themeProps,
      bridgeChart.value?.tokens?.theme,
    );
  });

  const sizeItem = computed(() => {
    return get(sizeClasses.value, merged.value.size);
  });

  const colorAssignments = computed(() => {
    return entries.value.map((entry, index) => {
      const key = resolveChartSeriesColor({
        index,
        color: entry.color,
        palette: palette.value,
      });

      return {
        color: key,
        id: entry.id,
        className: get(colorClasses.value, [key, "series"]) as
          string | undefined,
      };
    });
  });

  let stopColorScheme: undefined | (() => void);

  onMounted(() => {
    stopColorScheme = observeColorScheme(() => {
      schemeTick.value += 1;
    });
  });

  watch(
    [
      rootRef,
      schemeTick,
      themeClasses,
      colorAssignments,
      () => sizeItem.value?.root,
      () => bridge?.global.value.theme,
    ],
    () => {
      const rootEl = rootRef.value;

      if (isNil(rootEl)) {
        return;
      }

      const nextColors: Record<string, string> = {};

      colorAssignments.value.forEach((assignment) => {
        nextColors[assignment.id] = isNil(assignment.className)
          ? readCssColor(rootEl, { color: assignment.color })
          : readCssColor(rootEl, { className: assignment.className });
      });

      const nextTheme = readChartTheme(rootEl, {
        axis: themeClasses.value.axis ?? "",
        grid: themeClasses.value.grid ?? "",
        text: themeClasses.value.text ?? "",
      });

      if (!isEqual(colors.value, nextColors)) {
        colors.value = nextColors;
      }

      if (!isEqual(theme.value, nextTheme)) {
        theme.value = nextTheme;
      }
    },
    { flush: "post", immediate: true },
  );

  watch(
    plotRef,
    (plotEl, _, onCleanup) => {
      if (isNil(plotEl)) {
        return;
      }

      const measure = () => {
        const width = plotEl.clientWidth;
        const height = plotEl.clientHeight;

        if (
          plotSize.value.width !== width ||
          plotSize.value.height !== height
        ) {
          plotSize.value = { width, height };
        }
      };

      measure();

      if (typeof ResizeObserver === "undefined") {
        return;
      }

      const observer = new ResizeObserver(measure);
      observer.observe(plotEl);

      onCleanup(() => {
        observer.disconnect();
      });
    },
    { flush: "post", immediate: true },
  );

  function upsertSeries(entry: ChartSeriesEntry) {
    const index = entries.value.findIndex((item) => item.id === entry.id);

    if (index === -1) {
      entries.value = [...entries.value, entry];
      return;
    }

    if (isSameChartSeriesEntry(entries.value[index], entry)) {
      return;
    }

    const next = [...entries.value];
    next[index] = entry;
    entries.value = next;
  }

  function removeSeries(id: string) {
    entries.value = entries.value.filter((item) => item.id !== id);
  }

  function setAxis(
    position: ChartAxisPosition,
    options: Partial<ChartRenderAxis>,
  ) {
    const current = axes.value[position];

    if (!isNil(current) && isSameChartAxisOptions(current, options)) {
      return;
    }

    axes.value = { ...axes.value, [position]: options };
  }

  function removeAxis(position: ChartAxisPosition) {
    axes.value = omit(axes.value, [position]);
  }

  function toggleSeries(id: string) {
    hiddenSeries.value = hiddenSeries.value.includes(id)
      ? hiddenSeries.value.filter((item) => item !== id)
      : [...hiddenSeries.value, id];
  }

  function highlightSeries(id: null | string) {
    handleRef.value?.highlightSeries(id);
  }

  function onActiveIndexChange(index: null | number) {
    if (active.value.index !== index) {
      active.value = { index, source: "pointer" };
    }
  }

  const series = computed((): ChartResolvedSeries[] => {
    return entries.value.map((entry) => {
      return {
        ...entry,
        resolvedColor: colors.value[entry.id] ?? "",
        hidden: hiddenSeries.value.includes(entry.id),
      };
    });
  });

  const visibleSeries = computed(() => {
    return series.value.filter((item) => !item.hidden);
  });

  const xAxis = computed((): ChartRenderAxis => {
    return { ...DEFAULT_CHART_X_AXIS, ...axes.value.x };
  });

  const yAxis = computed((): ChartRenderAxis => {
    return { ...DEFAULT_CHART_Y_AXIS, ...axes.value.y };
  });

  const animation = computed(() => {
    return merged.value.animation !== false && !prefersReducedMotion();
  });

  const renderOptions = computed((): null | ChartRenderOptions => {
    if (isNil(theme.value)) {
      return null;
    }

    return {
      theme: theme.value,
      xAxis: xAxis.value,
      yAxis: yAxis.value,
      animation: animation.value,
      width: plotSize.value.width,
      categories: categories.value,
      height: plotSize.value.height,
      series: visibleSeries.value.map((item) => {
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          data: item.data,
          curve: item.curve,
          color: item.resolvedColor,
        };
      }),
    };
  });

  const isReady = computed(() => {
    return !isNil(hostRef.value) && !isNil(renderOptions.value);
  });

  function destroyHandle() {
    handleRef.value?.destroy();
    handleRef.value = null;
    renderedOptions = null;
    hostNode?.remove();
    hostNode = null;
  }

  watch(
    [hostRef, isReady],
    () => {
      destroyHandle();

      const hostEl = hostRef.value;
      const options = renderOptions.value;

      if (!isReady.value || isNil(hostEl) || isNil(options)) {
        return;
      }

      // Host is outside Vue's VNode children so engine DOM survives patches.
      const host = document.createElement("div");
      host.className = "absolute inset-0";
      hostEl.appendChild(host);
      hostNode = host;

      handleRef.value = mountEchartsChart({
        ...options,
        element: host,
        onActiveIndexChange,
      });

      renderedOptions = options;
    },
    { flush: "post", immediate: true },
  );

  watch(
    renderOptions,
    (options) => {
      const handle = handleRef.value;

      if (isNil(handle) || isNil(options) || renderedOptions === options) {
        return;
      }

      renderedOptions = options;
      handle.update(options);
    },
    { flush: "post" },
  );

  watch(
    active,
    (current) => {
      if (current.source === "keyboard") {
        handleRef.value?.setActiveIndex(current.index);
      }
    },
    { flush: "post" },
  );

  onBeforeUnmount(() => {
    stopColorScheme?.();
    destroyHandle();
  });

  const tooltipItems = computed(() => {
    const index = active.value.index;

    if (isNil(index)) {
      return [];
    }

    return getChartTooltipItems({
      index,
      series: visibleSeries.value.map((item) => {
        return { ...item, color: item.resolvedColor };
      }),
    });
  });

  function getTooltipAnchor(index: number) {
    const anchor = handleRef.value?.getCategoryAnchor(index);
    const plotEl = plotRef.value;

    if (isNil(anchor) || isNil(plotEl)) {
      return null;
    }

    return { y: anchor.y + plotEl.offsetTop, x: anchor.x + plotEl.offsetLeft };
  }

  function getBounds() {
    return {
      width: rootRef.value?.clientWidth ?? 0,
      height: rootRef.value?.clientHeight ?? 0,
    };
  }

  const contextValue = computed((): ChartContextValue => {
    return {
      setAxis,
      getBounds,
      removeAxis,
      id: chartId,
      removeSeries,
      toggleSeries,
      upsertSeries,
      highlightSeries,
      getTooltipAnchor,
      series: series.value,
      locale: locale.value,
      categories: categories.value,
      activeIndex: active.value.index,
      tooltipItems: tooltipItems.value,
      tokenClasses: {
        legend: get(sizeItem.value, "legend"),
        swatch: get(sizeItem.value, "swatch"),
        tooltip: get(sizeItem.value, "tooltip"),
        legendItem: get(sizeItem.value, "legendItem"),
      },
    };
  });

  provide(CHART_INJECTION_KEY, contextValue);

  const isLoading = computed(() => {
    return componentProps.value.loading === true;
  });

  const isEmpty = computed(() => {
    return !isLoading.value && isChartEmpty(entries.value);
  });

  const emptyMessage = computed(() => {
    return resolveMessage("No data");
  });

  const summary = computed(() => {
    if (!isNil(componentProps.value.summary)) {
      return componentProps.value.summary;
    }

    if (isChartEmpty(entries.value)) {
      return emptyMessage.value;
    }

    return resolveMessage(
      "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.",
      getChartSummaryParams({
        series: entries.value,
        categories: categories.value,
      }),
    );
  });

  const announcement = computed(() => {
    const index = active.value.index;

    if (active.value.source !== "keyboard" || isNil(index)) {
      return "";
    }

    return formatChartAnnouncement({
      locale: locale.value,
      items: tooltipItems.value,
      category: categories.value[index] ?? "",
    });
  });

  const table = computed(() => {
    return {
      categoryLabel: resolveMessage("Category"),
      series: entries.value.map((entry) => {
        return { id: entry.id, name: entry.name };
      }),
      rows: getChartTableRows({
        series: entries.value,
        categories: categories.value,
      }).map((row) => {
        return {
          category: row.category,
          values: row.values.map((value) => {
            return isNil(value) ? "—" : formatChartValue(value, locale.value);
          }),
        };
      }),
    };
  });

  function onPlotKeydown(event: KeyboardEvent) {
    customProps.value?.plot?.onKeydown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const next = getAdjacentChartIndex({
      key: event.key,
      current: active.value.index,
      count: categories.value.length,
    });

    if (next === undefined) {
      return;
    }

    event.preventDefault();
    active.value = { index: next, source: "keyboard" };
  }

  function onPlotBlur(event: FocusEvent) {
    customProps.value?.plot?.onBlur?.(event);

    if (active.value.source === "keyboard") {
      active.value = { index: null, source: "keyboard" };
    }
  }

  const rootBind = computed(() => {
    return mergePartBind(
      omit(customProps.value?.root, ["style"]),
      omit(split.value.inheritedAttrs, ["style"]),
      {
        role: "figure",
        style: [
          { width: toChartCssSize(componentProps.value.width, "100%") },
          split.value.inheritedAttrs.style,
          customProps.value?.root?.style,
        ],
        class: cn({
          "relative flex min-w-0 flex-col gap-3": true,
          [get(sizeItem.value, "root") ?? ""]: true,
          [get(mergedClasses.value, "root") ?? ""]: true,
        }),
      },
    ) as HTMLAttributes;
  });

  const plotBind = computed(() => {
    return mergePartBind(
      omit(customProps.value?.plot, ["style", "onBlur", "onKeydown"]),
      undefined,
      {
        role: "img",
        tabindex: 0,
        onBlur: onPlotBlur,
        onKeydown: onPlotKeydown,
        "aria-label": summary.value,
        style: [
          {
            height: toChartCssSize(
              merged.value.height,
              `${DEFAULT_CHART_HEIGHT}px`,
            ),
          },
          customProps.value?.plot?.style,
        ],
        class: cn({
          "relative w-full min-w-0 rounded-md outline-none": true,
          "focus-visible:ring-2 focus-visible:ring-primary-500/50": true,
          [get(mergedClasses.value, "plot") ?? ""]: true,
        }),
      },
    ) as HTMLAttributes;
  });

  const hostBind = computed((): HTMLAttributes => {
    return {
      "aria-hidden": true,
      class: "absolute inset-0",
    };
  });

  const loadingBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "absolute inset-0 z-10 flex": true,
        [get(mergedClasses.value, "loading") ?? ""]: true,
      }),
    };
  });

  const emptyBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "absolute inset-0 z-10 flex items-center justify-center": true,
        "text-dark-500 dark:text-dark-400": true,
        [get(mergedClasses.value, "empty") ?? ""]: true,
      }),
    };
  });

  const tableBind = computed((): HTMLAttributes => {
    return {
      id: `${chartId}-table`,
      class: cn({
        "sr-only block": true,
        [get(mergedClasses.value, "table") ?? ""]: true,
      }),
    };
  });

  const liveBind = computed((): HTMLAttributes => {
    return {
      role: "status",
      class: "sr-only",
      "aria-atomic": true,
      "aria-live": "polite",
    };
  });

  return {
    table,
    merged,
    isEmpty,
    summary,
    hostBind,
    plotBind,
    rootBind,
    liveBind,
    emptyBind,
    isLoading,
    tableBind,
    loadingBind,
    announcement,
    contextValue,
    emptyMessage,
  };
}
