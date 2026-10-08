// ** External Imports
import {
  get,
  isEqual,
  isNil,
  isUndefined,
  omit,
  omitBy,
  pick,
} from "es-toolkit/compat";
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
  type ComputedRef,
  type HTMLAttributes,
} from "vue";

// ** Core Imports
import type { BridgeUIComponentsConfig } from "@bridge-ui/core/Config";
import {
  DEFAULT_CHART_HEIGHT,
  DEFAULT_CHART_PALETTE,
  formatChartAnnouncement,
  getAdjacentChartIndex,
  resolveChartColor,
  toChartCssSize,
  type ChartBaseRenderOptions,
  type ChartHandle,
  type ChartMountOptions,
  type ChartRenderTheme,
  type ChartTable,
  type ChartTooltipContent,
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
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import type {
  ChartClasses,
  ChartRootOwnProps,
} from "@/Utils/Charts/chart.types";
import {
  CHART_INJECTION_KEY,
  type ChartContextValue,
  type ChartLegendItem,
  type ChartLegendPosition,
} from "@/Utils/Charts/chartInjectionKey";

/**
 * Registry names of the chart roots.
 */
export type ChartRootName = Extract<
  keyof BridgeUIComponentsConfig,
  "ChartBar" | "ChartPie" | "ChartLine" | "ChartFunnel" | "ChartScatter"
>;

/**
 * Merged props every chart root resolves.
 */
export type ChartRootMerged = Pick<
  ChartRootOwnProps,
  "palette" | "customProps"
> & {
  animation: boolean;
  height: number | string;
  size: string;
};

/**
 * Bridge keys shared by every chart root.
 */
export const chartRootBridgeKeys = [
  "size",
  "width",
  "height",
  "classes",
  "loading",
  "palette",
  "summary",
  "animation",
  "customProps",
] as const satisfies readonly (keyof ChartRootOwnProps)[];

type ChartActive = {
  index: null | number;
  source: "pointer" | "keyboard";
};

/**
 * Shared state for a chart root: registry merge, tokens, theme, plot size,
 * active item, hidden items, and the mounted plot handle.
 */
export function useChartRoot<Merged extends ChartRootMerged>({
  props,
  bridgeKeys,
  libDefaults,
  registryKeys,
  componentName,
  fallbackProps,
}: {
  bridgeKeys: readonly string[];
  componentName: ChartRootName;
  /**
   * Props that win over registry defaults but lose to explicit props
   * (e.g. the sparkline height).
   */
  fallbackProps?: () => Partial<ChartRootOwnProps>;
  libDefaults: Partial<Merged>;
  props: ChartRootOwnProps;
  registryKeys: readonly string[];
}) {
  const vueId = useId();
  const attrs = useAttrs();
  const chartId = `bridge-chart${vueId}`;

  const resolveMessage = useResolveMessage();

  const rootRef = shallowRef<null | HTMLDivElement>(null);
  const plotRef = shallowRef<null | HTMLDivElement>(null);
  const hostRef = shallowRef<null | HTMLDivElement>(null);

  const handleRef = shallowRef<null | ChartHandle<ChartBaseRenderOptions>>(
    null,
  );

  const schemeTick = ref(0);
  const hidden = ref<string[]>([]);
  const plotSize = shallowRef({ width: 0, height: 0 });
  const theme = shallowRef<null | ChartRenderTheme>(null);
  const legendPosition = ref<null | ChartLegendPosition>(null);

  const active = shallowRef<ChartActive>({
    index: null,
    source: "pointer",
  });

  const split = computed(() => {
    return splitComponentProps<Record<string, unknown>, readonly string[]>({
      bridgeKeys,
      props: {
        ...fallbackProps?.(),
        ...omitBy({ ...attrs, ...props }, isUndefined),
      },
    }) as {
      componentProps: Record<string, unknown> & ChartRootOwnProps;
      inheritedAttrs: HTMLAttributes & Record<string, unknown>;
    };
  });

  const componentProps = computed(() => {
    return split.value.componentProps;
  });

  const {
    bridge,
    merged,
    entry: bridgeChart,
  } = useBridgeUIComponent<Merged, ChartRootName>({
    libDefaults,
    componentName,
    props: () => pick(componentProps.value, registryKeys) as Partial<Merged>,
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

  const bridgeTheme = computed(() => {
    return bridge?.global.value.theme;
  });

  let stopColorScheme: undefined | (() => void);

  onMounted(() => {
    stopColorScheme = observeColorScheme(() => {
      schemeTick.value += 1;
    });
  });

  onBeforeUnmount(() => {
    stopColorScheme?.();
  });

  watch(
    [
      rootRef,
      schemeTick,
      themeClasses,
      () => sizeItem.value?.root,
      bridgeTheme,
    ],
    () => {
      const rootEl = rootRef.value;

      if (isNil(rootEl)) {
        return;
      }

      const next = readChartTheme(rootEl, {
        axis: themeClasses.value.axis ?? "",
        grid: themeClasses.value.grid ?? "",
        text: themeClasses.value.text ?? "",
      });

      if (!isEqual(theme.value, next)) {
        theme.value = next;
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

  function toggleItem(id: string) {
    hidden.value = hidden.value.includes(id)
      ? hidden.value.filter((item) => item !== id)
      : [...hidden.value, id];
  }

  function highlightItem(id: null | string) {
    handleRef.value?.highlight(id);
  }

  function onActiveIndexChange(index: null | number) {
    if (active.value.index !== index) {
      active.value = { index, source: "pointer" };
    }
  }

  function getTooltipAnchor(index: number) {
    const anchor = handleRef.value?.getAnchor(index);
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

  function setLegendPosition(position: null | ChartLegendPosition) {
    legendPosition.value = position;
  }

  const animation = computed(() => {
    return merged.value.animation !== false && !prefersReducedMotion();
  });

  return {
    split,
    theme,
    merged,
    active,
    hidden,
    locale,
    chartId,
    palette,
    rootRef,
    plotRef,
    hostRef,
    plotSize,
    sizeItem,
    animation,
    handleRef,
    getBounds,
    schemeTick,
    toggleItem,
    bridgeTheme,
    customProps,
    colorClasses,
    highlightItem,
    mergedClasses,
    legendPosition,
    resolveMessage,
    componentProps,
    getTooltipAnchor,
    setLegendPosition,
    onActiveIndexChange,
  };
}

/**
 * State returned by {@link useChartRoot}.
 */
export type ChartRootState = ReturnType<typeof useChartRoot>;

/**
 * Resolves item colors (token keys or CSS colors) to computed CSS colors.
 * Items without `color` take palette entries in order.
 */
export function useChartColors(
  root: ChartRootState,
  items: () => ReadonlyArray<{ color?: string; id: string }>,
) {
  const colors = shallowRef<Record<string, string>>({});

  const assignments = computed(() => {
    return items().map((item, index) => {
      const key = resolveChartColor({
        index,
        color: item.color,
        palette: root.palette.value,
      });

      return {
        color: key,
        id: item.id,
        className: get(root.colorClasses.value, [key, "series"]) as
          string | undefined,
      };
    });
  });

  watch(
    [root.rootRef, root.schemeTick, root.bridgeTheme, assignments],
    () => {
      const rootEl = root.rootRef.value;

      if (isNil(rootEl)) {
        return;
      }

      const next: Record<string, string> = {};

      assignments.value.forEach((assignment) => {
        next[assignment.id] = isNil(assignment.className)
          ? readCssColor(rootEl, { color: assignment.color })
          : readCssColor(rootEl, { className: assignment.className });
      });

      if (!isEqual(colors.value, next)) {
        colors.value = next;
      }
    },
    { flush: "post", immediate: true },
  );

  return colors;
}

/**
 * Mounts the plot into the host once the theme and size are known, then
 * pushes every new options object to it.
 */
export function useChartPlot<Options extends ChartBaseRenderOptions>(
  root: ChartRootState,
  {
    mount,
    options,
  }: {
    mount: (options: ChartMountOptions<Options>) => ChartHandle<Options>;
    options: ComputedRef<null | Options>;
  },
) {
  let hostNode: null | HTMLDivElement = null;
  let rendered: null | Options = null;

  const isReady = computed(() => {
    return !isNil(root.hostRef.value) && !isNil(options.value);
  });

  function destroyHandle() {
    root.handleRef.value?.destroy();
    root.handleRef.value = null;
    rendered = null;
    hostNode?.remove();
    hostNode = null;
  }

  watch(
    [root.hostRef, isReady],
    () => {
      destroyHandle();

      const hostEl = root.hostRef.value;
      const current = options.value;

      if (!isReady.value || isNil(hostEl) || isNil(current)) {
        return;
      }

      // Host is outside Vue's VNode children so engine DOM survives patches.
      const host = document.createElement("div");
      host.className = "absolute inset-0";
      hostEl.appendChild(host);
      hostNode = host;

      root.handleRef.value = mount({
        ...current,
        element: host,
        onActiveIndexChange: root.onActiveIndexChange,
      }) as ChartHandle<ChartBaseRenderOptions>;

      rendered = current;
    },
    { flush: "post", immediate: true },
  );

  watch(
    options,
    (next) => {
      const handle = root.handleRef.value;

      if (isNil(handle) || isNil(next) || rendered === next) {
        return;
      }

      rendered = next;
      handle.update(next);
    },
    { flush: "post" },
  );

  watch(
    root.active,
    (current) => {
      if (current.source === "keyboard") {
        root.handleRef.value?.setActiveIndex(current.index);
      }
    },
    { flush: "post" },
  );

  onBeforeUnmount(() => {
    destroyHandle();
  });
}

/**
 * Root, plot, and overlay binds plus keyboard navigation over `count` items.
 */
export function useChartFrame(
  root: ChartRootState,
  state: ComputedRef<{
    count: number;
    isEmpty: boolean;
    summary: string;
    table: ChartTable;
    tooltip: null | ChartTooltipContent;
  }>,
) {
  const { active, customProps, mergedClasses, componentProps } = root;

  const isLoading = computed(() => {
    return componentProps.value.loading === true;
  });

  const isEmpty = computed(() => {
    return !isLoading.value && state.value.isEmpty;
  });

  const emptyMessage = computed(() => {
    return root.resolveMessage("No data");
  });

  const label = computed(() => {
    if (!isNil(componentProps.value.summary)) {
      return componentProps.value.summary;
    }

    return state.value.isEmpty ? emptyMessage.value : state.value.summary;
  });

  const announcement = computed(() => {
    const tooltip = state.value.tooltip;

    if (active.value.source !== "keyboard" || isNil(tooltip)) {
      return "";
    }

    return formatChartAnnouncement({
      title: tooltip.title,
      items: tooltip.items,
      locale: root.locale.value,
    });
  });

  const isSideLegend = computed(() => {
    const position = root.legendPosition.value;

    return position === "left" || position === "right";
  });

  function onPlotKeydown(event: KeyboardEvent) {
    customProps.value?.plot?.onKeydown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const next = getAdjacentChartIndex({
      key: event.key,
      count: state.value.count,
      current: active.value.index,
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
      omit(root.split.value.inheritedAttrs, ["style"]),
      {
        role: "figure",
        "aria-busy": isLoading.value || undefined,
        style: [
          { width: toChartCssSize(componentProps.value.width, "100%") },
          root.split.value.inheritedAttrs.style,
          customProps.value?.root?.style,
        ],
        class: cn({
          "relative flex min-w-0 gap-3": true,
          "flex-col": !isSideLegend.value,
          "flex-row items-center gap-6": isSideLegend.value,
          [get(root.sizeItem.value, "root") ?? ""]: true,
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
        "aria-label": label.value,
        style: [
          {
            height: toChartCssSize(
              root.merged.value.height,
              `${DEFAULT_CHART_HEIGHT}px`,
            ),
          },
          customProps.value?.plot?.style,
        ],
        class: cn({
          "relative min-w-0 rounded-md outline-none": true,
          "w-full": !isSideLegend.value,
          "flex-1": isSideLegend.value,
          "focus-visible:ring-2 focus-visible:ring-primary-500/50": true,
          [get(mergedClasses.value, "plot") ?? ""]: true,
        }),
      },
    ) as HTMLAttributes;
  });

  const hostBind = computed((): HTMLAttributes => {
    return { "aria-hidden": true, class: "absolute inset-0" };
  });

  const centerBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center": true,
        [get(mergedClasses.value, "center") ?? ""]: true,
      }),
    };
  });

  const loadingBind = computed((): HTMLAttributes => {
    return {
      class: cn({
        "absolute inset-0 z-10 flex items-center justify-center": true,
        "bg-white/50 dark:bg-dark-900/50": true,
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
      id: `${root.chartId}-table`,
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

  const table = computed(() => {
    return state.value.table;
  });

  return {
    label,
    table,
    isEmpty,
    hostBind,
    plotBind,
    rootBind,
    liveBind,
    emptyBind,
    isLoading,
    tableBind,
    centerBind,
    loadingBind,
    announcement,
    emptyMessage,
    rootRef: root.rootRef,
    plotRef: root.plotRef,
    hostRef: root.hostRef,
  };
}

/**
 * Frame state returned by {@link useChartFrame}.
 */
export type ChartFrameState = ReturnType<typeof useChartFrame>;

/**
 * Provides the context value for the chart parts.
 */
export function useChartContextValue(
  root: ChartRootState,
  state: ComputedRef<
    Pick<
      ChartContextValue,
      | "family"
      | "setAxis"
      | "tooltip"
      | "removeAxis"
      | "legendItems"
      | "removeSeries"
      | "upsertSeries"
    >
  >,
): ComputedRef<ChartContextValue> {
  const context = computed((): ChartContextValue => {
    return {
      ...state.value,
      id: root.chartId,
      getBounds: root.getBounds,
      locale: root.locale.value,
      toggleItem: root.toggleItem,
      highlightItem: root.highlightItem,
      activeIndex: root.active.value.index,
      getTooltipAnchor: root.getTooltipAnchor,
      setLegendPosition: root.setLegendPosition,
      tokenClasses: {
        legend: get(root.sizeItem.value, "legend"),
        swatch: get(root.sizeItem.value, "swatch"),
        tooltip: get(root.sizeItem.value, "tooltip"),
        legendItem: get(root.sizeItem.value, "legendItem"),
      },
    };
  });

  provide(CHART_INJECTION_KEY, context);

  return context;
}

/**
 * Legend entries from items, their resolved colors, and the hidden ids.
 */
export function toChartLegendItems(
  items: ReadonlyArray<
    Pick<ChartLegendItem, "id" | "name" | "value" | "percent">
  >,
  colors: Record<string, string>,
  hidden: readonly string[],
): ChartLegendItem[] {
  return items.map((item) => {
    return {
      ...item,
      color: colors[item.id] ?? "",
      hidden: hidden.includes(item.id),
    };
  });
}
