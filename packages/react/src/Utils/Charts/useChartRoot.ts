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
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from "react";

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
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import type {
  ChartClasses,
  ChartRootOwnProps,
} from "@/Utils/Charts/chart.types";
import type {
  ChartContextValue,
  ChartLegendItem,
  ChartLegendPosition,
} from "@/Utils/Charts/ChartContext";

/**
 * Registry names of the chart roots.
 */
export type ChartRootName = Extract<
  keyof BridgeUIComponentsConfig,
  "ChartBar" | "ChartPie" | "ChartLine" | "ChartFunnel" | "ChartScatter"
>;

/**
 * Props every chart root hook receives.
 */
export type ChartRootProps = ChartRootOwnProps & HTMLAttributes<HTMLDivElement>;

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
  "slots",
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
  fallbackProps?: Partial<ChartRootOwnProps>;
  libDefaults: Partial<Merged>;
  props: ChartRootProps;
  registryKeys: readonly string[];
}) {
  const reactId = useId();
  const chartId = `bridge-chart${reactId.replace(/:/g, "")}`;

  const resolveMessage = useResolveMessage();

  const handleRef = useRef<null | ChartHandle<ChartBaseRenderOptions>>(null);

  const [schemeTick, setSchemeTick] = useState(0);
  const [hidden, setHidden] = useState<string[]>([]);
  const [plotEl, setPlotEl] = useState<null | HTMLDivElement>(null);
  const [rootEl, setRootEl] = useState<null | HTMLDivElement>(null);
  const [hostEl, setHostEl] = useState<null | HTMLDivElement>(null);
  const [theme, setTheme] = useState<null | ChartRenderTheme>(null);
  const [plotSize, setPlotSize] = useState({ width: 0, height: 0 });

  const [legendPosition, setLegendPosition] =
    useState<null | ChartLegendPosition>(null);

  const [active, setActive] = useState<ChartActive>({
    index: null,
    source: "pointer",
  });

  const { componentProps, inheritedAttrs } = splitComponentProps<
    Record<string, unknown>,
    readonly string[]
  >({
    bridgeKeys,
    props: { ...fallbackProps, ...omitBy(props, isUndefined) },
  }) as {
    componentProps: Record<string, unknown> & ChartRootOwnProps;
    inheritedAttrs: HTMLAttributes<HTMLDivElement>;
  };

  const {
    bridge,
    merged,
    entry: bridgeChart,
  } = useBridgeUIComponent<Merged, ChartRootName>({
    libDefaults,
    componentName,
    props: pick(componentProps, registryKeys) as Partial<Merged>,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChartClasses>({
    entry: bridgeChart,
    props: componentProps,
  });

  const locale = derived(() => {
    return bridge?.global.locale ?? "en-US";
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const paletteSignature = JSON.stringify(
    componentProps.palette ?? merged.palette ?? DEFAULT_CHART_PALETTE,
  );

  const palette = useMemo(() => {
    return JSON.parse(paletteSignature) as string[];
  }, [paletteSignature]);

  const tokens = bridgeChart?.tokens;

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(sizeProps, tokens?.size);
  }, [tokens?.size]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(colorProps, tokens?.color);
  }, [tokens?.color]);

  const themeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(themeProps, tokens?.theme);
  }, [tokens?.theme]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  useEffect(() => {
    return observeColorScheme(() => {
      setSchemeTick((tick) => tick + 1);
    });
  }, []);

  useLayoutEffect(() => {
    if (isNil(rootEl)) {
      return;
    }

    const nextTheme = readChartTheme(rootEl, {
      axis: themeClasses.axis ?? "",
      grid: themeClasses.grid ?? "",
      text: themeClasses.text ?? "",
    });

    setTheme((previous) => {
      return isEqual(previous, nextTheme) ? previous : nextTheme;
    });
  }, [rootEl, schemeTick, themeClasses, sizeItem?.root, bridge?.global.theme]);

  useLayoutEffect(() => {
    if (isNil(plotEl)) {
      return;
    }

    const measure = () => {
      const width = plotEl.clientWidth;
      const height = plotEl.clientHeight;

      setPlotSize((previous) => {
        return previous.width === width && previous.height === height
          ? previous
          : { width, height };
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(plotEl);

    return () => {
      observer.disconnect();
    };
  }, [plotEl]);

  const toggleItem = useCallback((id: string) => {
    setHidden((previous) => {
      return previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
    });
  }, []);

  const highlightItem = useCallback((id: null | string) => {
    handleRef.current?.highlight(id);
  }, []);

  const onActiveIndexChange = useCallback((index: null | number) => {
    setActive((previous) => {
      return previous.index === index ? previous : { index, source: "pointer" };
    });
  }, []);

  const getTooltipAnchor = useCallback(
    (index: number) => {
      const anchor = handleRef.current?.getAnchor(index);

      if (isNil(anchor) || isNil(plotEl)) {
        return null;
      }

      return {
        y: anchor.y + plotEl.offsetTop,
        x: anchor.x + plotEl.offsetLeft,
      };
    },
    [plotEl],
  );

  const getBounds = useCallback(() => {
    return {
      width: rootEl?.clientWidth ?? 0,
      height: rootEl?.clientHeight ?? 0,
    };
  }, [rootEl]);

  const animation = derived(() => {
    return merged.animation !== false && !prefersReducedMotion();
  });

  return {
    theme,
    merged,
    active,
    hidden,
    rootEl,
    hostEl,
    plotEl,
    locale,
    chartId,
    palette,
    plotSize,
    sizeItem,
    setRootEl,
    setPlotEl,
    setHostEl,
    animation,
    setActive,
    handleRef,
    getBounds,
    schemeTick,
    toggleItem,
    customProps,
    colorClasses,
    mergedClasses,
    highlightItem,
    inheritedAttrs,
    legendPosition,
    resolveMessage,
    componentProps,
    getTooltipAnchor,
    setLegendPosition,
    onActiveIndexChange,
    bridgeTheme: bridge?.global.theme,
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
  items: ReadonlyArray<{ color?: string; id: string }>,
): Record<string, string> {
  const [colors, setColors] = useState<Record<string, string>>({});

  const { rootEl, palette, schemeTick, bridgeTheme, colorClasses } = root;

  const assignments = useMemo(() => {
    return items.map((item, index) => {
      const key = resolveChartColor({ index, palette, color: item.color });

      return {
        color: key,
        id: item.id,
        className: get(colorClasses, [key, "series"]) as string | undefined,
      };
    });
  }, [items, palette, colorClasses]);

  useLayoutEffect(() => {
    if (isNil(rootEl)) {
      return;
    }

    const next: Record<string, string> = {};

    assignments.forEach((assignment) => {
      next[assignment.id] = isNil(assignment.className)
        ? readCssColor(rootEl, { color: assignment.color })
        : readCssColor(rootEl, { className: assignment.className });
    });

    setColors((previous) => {
      return isEqual(previous, next) ? previous : next;
    });
  }, [rootEl, schemeTick, bridgeTheme, assignments]);

  return colors;
}

/**
 * Mounts the plot into the host once the theme and size are known, then
 * pushes every new `options` object to it.
 */
export function useChartPlot<Options extends ChartBaseRenderOptions>(
  root: ChartRootState,
  {
    mount,
    options,
  }: {
    mount: (options: ChartMountOptions<Options>) => ChartHandle<Options>;
    options: null | Options;
  },
) {
  const optionsRef = useRef<null | Options>(null);
  const renderedRef = useRef<null | Options>(null);

  const { hostEl, active, handleRef, onActiveIndexChange } = root;

  const isReady = !isNil(hostEl) && !isNil(options);

  useLayoutEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useLayoutEffect(() => {
    const current = optionsRef.current;

    if (!isReady || isNil(hostEl) || isNil(current)) {
      return;
    }

    // Host lives outside React's child fiber so engine DOM survives re-renders.
    const host = document.createElement("div");
    host.className = "absolute inset-0";
    hostEl.appendChild(host);

    const handle = mount({ ...current, element: host, onActiveIndexChange });

    handleRef.current = handle as ChartHandle<ChartBaseRenderOptions>;
    renderedRef.current = current;

    return () => {
      handle.destroy();
      handleRef.current = null;
      renderedRef.current = null;
      host.remove();
    };
  }, [mount, hostEl, isReady, handleRef, onActiveIndexChange]);

  useLayoutEffect(() => {
    const handle = handleRef.current;

    if (isNil(handle) || isNil(options) || renderedRef.current === options) {
      return;
    }

    renderedRef.current = options;
    handle.update(options);
  }, [options, handleRef]);

  useEffect(() => {
    if (active.source === "keyboard") {
      handleRef.current?.setActiveIndex(active.index);
    }
  }, [active, handleRef]);
}

/**
 * Root, plot, and overlay binds plus keyboard navigation over `count` items.
 */
export function useChartFrame(
  root: ChartRootState,
  {
    count,
    table,
    isEmpty,
    summary,
    tooltip,
  }: {
    count: number;
    isEmpty: boolean;
    summary: string;
    table: ChartTable;
    tooltip: null | ChartTooltipContent;
  },
) {
  const {
    merged,
    active,
    locale,
    chartId,
    sizeItem,
    setActive,
    setRootEl,
    setPlotEl,
    setHostEl,
    customProps,
    mergedClasses,
    legendPosition,
    inheritedAttrs,
    resolveMessage,
    componentProps,
  } = root;

  const isLoading = componentProps.loading === true;

  const emptyMessage = resolveMessage("No data");

  const label = derived(() => {
    if (!isNil(componentProps.summary)) {
      return componentProps.summary;
    }

    return isEmpty ? emptyMessage : summary;
  });

  const announcement = derived(() => {
    if (active.source !== "keyboard" || isNil(tooltip)) {
      return "";
    }

    return formatChartAnnouncement({
      locale,
      title: tooltip.title,
      items: tooltip.items,
    });
  });

  const onPlotKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    customProps?.plot?.onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const next = getAdjacentChartIndex({
      count,
      key: event.key,
      current: active.index,
    });

    if (next === undefined) {
      return;
    }

    event.preventDefault();

    const { key } = event;

    setActive((previous) => {
      return {
        source: "keyboard",
        index:
          getAdjacentChartIndex({ key, count, current: previous.index }) ??
          null,
      };
    });
  };

  const onPlotBlur = (event: FocusEvent<HTMLDivElement>) => {
    customProps?.plot?.onBlur?.(event);

    setActive((previous) => {
      return previous.source === "keyboard"
        ? { index: null, source: "keyboard" }
        : previous;
    });
  };

  const isSideLegend = legendPosition === "left" || legendPosition === "right";

  const rootBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return mergePartBind(
      omit(customProps?.root, ["style"]),
      omit(inheritedAttrs, ["children", "style"]),
      {
        ref: setRootEl,
        role: "figure",
        "aria-busy": isLoading || undefined,
        style: {
          width: toChartCssSize(componentProps.width, "100%"),
          ...inheritedAttrs.style,
          ...customProps?.root?.style,
        },
        className: cn({
          "relative flex min-w-0 gap-3": true,
          "flex-col": !isSideLegend,
          "flex-row items-center gap-6": isSideLegend,
          [get(sizeItem, "root") ?? ""]: true,
          [get(mergedClasses, "root") ?? ""]: true,
        }),
      },
    ) as HTMLAttributes<HTMLDivElement>;
  });

  const plotBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return mergePartBind(
      omit(customProps?.plot, ["style", "onBlur", "onKeyDown"]),
      undefined,
      {
        role: "img",
        tabIndex: 0,
        ref: setPlotEl,
        onBlur: onPlotBlur,
        "aria-label": label,
        onKeyDown: onPlotKeyDown,
        style: {
          height: toChartCssSize(merged.height, `${DEFAULT_CHART_HEIGHT}px`),
          ...customProps?.plot?.style,
        },
        className: cn({
          "relative min-w-0 rounded-md outline-none": true,
          "w-full": !isSideLegend,
          "flex-1": isSideLegend,
          "focus-visible:ring-2 focus-visible:ring-primary-500/50": true,
          [get(mergedClasses, "plot") ?? ""]: true,
        }),
      },
    ) as HTMLAttributes<HTMLDivElement>;
  });

  const hostBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      ref: setHostEl,
      "aria-hidden": true,
      className: "absolute inset-0",
    } as HTMLAttributes<HTMLDivElement>;
  });

  const centerBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: cn({
        "pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center": true,
        [get(mergedClasses, "center") ?? ""]: true,
      }),
    };
  });

  const loadingBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: cn({
        "absolute inset-0 z-10 flex items-center justify-center": true,
        "bg-white/50 dark:bg-dark-900/50": true,
        [get(mergedClasses, "loading") ?? ""]: true,
      }),
    };
  });

  const emptyBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: cn({
        "absolute inset-0 z-10 flex items-center justify-center": true,
        "text-dark-500 dark:text-dark-400": true,
        [get(mergedClasses, "empty") ?? ""]: true,
      }),
    };
  });

  const tableBind = derived((): HTMLAttributes<HTMLTableElement> => {
    return {
      id: `${chartId}-table`,
      className: cn({
        "sr-only block": true,
        [get(mergedClasses, "table") ?? ""]: true,
      }),
    };
  });

  const liveBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      role: "status",
      "aria-atomic": true,
      className: "sr-only",
      "aria-live": "polite",
    };
  });

  return {
    table,
    label,
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
    slots: componentProps.slots,
    isEmpty: !isLoading && isEmpty,
  };
}

/**
 * Frame state returned by {@link useChartFrame}.
 */
export type ChartFrameState = ReturnType<typeof useChartFrame>;

/**
 * Context value for the chart parts.
 */
export function useChartContextValue(
  root: ChartRootState,
  {
    family,
    tooltip,
    setAxis,
    removeAxis,
    legendItems,
    upsertSeries,
    removeSeries,
  }: Pick<
    ChartContextValue,
    | "family"
    | "setAxis"
    | "tooltip"
    | "removeAxis"
    | "legendItems"
    | "removeSeries"
    | "upsertSeries"
  >,
): ChartContextValue {
  const {
    active,
    locale,
    chartId,
    sizeItem,
    getBounds,
    toggleItem,
    highlightItem,
    getTooltipAnchor,
    setLegendPosition,
  } = root;

  return useMemo((): ChartContextValue => {
    return {
      family,
      locale,
      setAxis,
      tooltip,
      getBounds,
      removeAxis,
      toggleItem,
      legendItems,
      id: chartId,
      upsertSeries,
      removeSeries,
      highlightItem,
      getTooltipAnchor,
      setLegendPosition,
      activeIndex: active.index,
      tokenClasses: {
        legend: get(sizeItem, "legend"),
        swatch: get(sizeItem, "swatch"),
        tooltip: get(sizeItem, "tooltip"),
        legendItem: get(sizeItem, "legendItem"),
      },
    };
  }, [
    family,
    locale,
    chartId,
    setAxis,
    tooltip,
    sizeItem,
    getBounds,
    removeAxis,
    toggleItem,
    legendItems,
    upsertSeries,
    removeSeries,
    active.index,
    highlightItem,
    getTooltipAnchor,
    setLegendPosition,
  ]);
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
