// ** External Imports
import { get, isEqual, isNil, omit } from "es-toolkit/compat";
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
import type {
  ChartContextValue,
  ChartResolvedSeries,
} from "@/Components/Chart/ChartContext";
import { mountEchartsChart } from "@/Components/Chart/echartsChart";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const chartBridgeKeys = [
  "size",
  "slots",
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

export function useChart(props: ChartProps, libDefaults: ChartLibDefaults) {
  const reactId = useId();
  const chartId = `bridge-chart${reactId.replace(/:/g, "")}`;

  const resolveMessage = useResolveMessage();

  const handleRef = useRef<null | ChartHandle>(null);
  const renderOptionsRef = useRef<null | ChartRenderOptions>(null);
  const renderedOptionsRef = useRef<null | ChartRenderOptions>(null);

  const [schemeTick, setSchemeTick] = useState(0);
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const [entries, setEntries] = useState<ChartSeriesEntry[]>([]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [plotEl, setPlotEl] = useState<null | HTMLDivElement>(null);
  const [rootEl, setRootEl] = useState<null | HTMLDivElement>(null);
  const [hostEl, setHostEl] = useState<null | HTMLDivElement>(null);
  const [theme, setTheme] = useState<null | ChartRenderTheme>(null);
  const [plotSize, setPlotSize] = useState({ width: 0, height: 0 });

  const [active, setActive] = useState<ChartActive>({
    index: null,
    source: "pointer",
  });

  const [axes, setAxes] = useState<
    Partial<Record<ChartAxisPosition, Partial<ChartRenderAxis>>>
  >({});

  const { componentProps, inheritedAttrs } = splitComponentProps<
    ChartProps,
    typeof chartBridgeKeys
  >({
    props,
    bridgeKeys: chartBridgeKeys,
  });

  const {
    bridge,
    merged,
    entry: bridgeChart,
  } = useBridgeUIComponent<ChartMerged, "Chart">({
    libDefaults,
    componentName: "Chart",
    props: omit(componentProps, ["palette", "categories"]),
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

  const slots = derived(() => {
    return componentProps.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const categoriesSignature = JSON.stringify(componentProps.categories ?? []);

  const categories = useMemo(() => {
    return JSON.parse(categoriesSignature) as string[];
  }, [categoriesSignature]);

  const paletteSignature = JSON.stringify(
    componentProps.palette ?? merged.palette ?? DEFAULT_CHART_PALETTE,
  );

  const palette = useMemo(() => {
    return JSON.parse(paletteSignature) as string[];
  }, [paletteSignature]);

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(sizeProps, bridgeChart?.tokens?.size);
  }, [bridgeChart?.tokens?.size]);

  const colorClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(colorProps, bridgeChart?.tokens?.color);
  }, [bridgeChart?.tokens?.color]);

  const themeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(themeProps, bridgeChart?.tokens?.theme);
  }, [bridgeChart?.tokens?.theme]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const colorAssignments = useMemo(() => {
    return entries.map((entry, index) => {
      const key = resolveChartSeriesColor({
        index,
        palette,
        color: entry.color,
      });

      return {
        color: key,
        id: entry.id,
        className: get(colorClasses, [key, "series"]) as string | undefined,
      };
    });
  }, [entries, palette, colorClasses]);

  useEffect(() => {
    return observeColorScheme(() => {
      setSchemeTick((tick) => tick + 1);
    });
  }, []);

  useLayoutEffect(() => {
    if (isNil(rootEl)) {
      return;
    }

    const nextColors: Record<string, string> = {};

    colorAssignments.forEach((assignment) => {
      nextColors[assignment.id] = isNil(assignment.className)
        ? readCssColor(rootEl, { color: assignment.color })
        : readCssColor(rootEl, { className: assignment.className });
    });

    const nextTheme = readChartTheme(rootEl, {
      axis: themeClasses.axis ?? "",
      grid: themeClasses.grid ?? "",
      text: themeClasses.text ?? "",
    });

    setColors((previous) => {
      return isEqual(previous, nextColors) ? previous : nextColors;
    });

    setTheme((previous) => {
      return isEqual(previous, nextTheme) ? previous : nextTheme;
    });
  }, [
    rootEl,
    schemeTick,
    themeClasses,
    sizeItem?.root,
    colorAssignments,
    bridge?.global.theme,
  ]);

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

  const upsertSeries = useCallback((entry: ChartSeriesEntry) => {
    setEntries((previous) => {
      const index = previous.findIndex((item) => item.id === entry.id);

      if (index === -1) {
        return [...previous, entry];
      }

      if (isSameChartSeriesEntry(previous[index], entry)) {
        return previous;
      }

      const next = [...previous];
      next[index] = entry;

      return next;
    });
  }, []);

  const removeSeries = useCallback((id: string) => {
    setEntries((previous) => {
      return previous.filter((item) => item.id !== id);
    });
  }, []);

  const setAxis = useCallback(
    (position: ChartAxisPosition, options: Partial<ChartRenderAxis>) => {
      setAxes((previous) => {
        const current = previous[position];

        if (!isNil(current) && isSameChartAxisOptions(current, options)) {
          return previous;
        }

        return { ...previous, [position]: options };
      });
    },
    [],
  );

  const removeAxis = useCallback((position: ChartAxisPosition) => {
    setAxes((previous) => {
      return omit(previous, [position]);
    });
  }, []);

  const toggleSeries = useCallback((id: string) => {
    setHiddenSeries((previous) => {
      return previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
    });
  }, []);

  const highlightSeries = useCallback((id: null | string) => {
    handleRef.current?.highlightSeries(id);
  }, []);

  const onActiveIndexChange = useCallback((index: null | number) => {
    setActive((previous) => {
      return previous.index === index ? previous : { index, source: "pointer" };
    });
  }, []);

  const series = useMemo((): ChartResolvedSeries[] => {
    return entries.map((entry) => {
      return {
        ...entry,
        resolvedColor: colors[entry.id] ?? "",
        hidden: hiddenSeries.includes(entry.id),
      };
    });
  }, [entries, colors, hiddenSeries]);

  const visibleSeries = useMemo(() => {
    return series.filter((item) => !item.hidden);
  }, [series]);

  const xAxis = useMemo((): ChartRenderAxis => {
    return { ...DEFAULT_CHART_X_AXIS, ...axes.x };
  }, [axes.x]);

  const yAxis = useMemo((): ChartRenderAxis => {
    return { ...DEFAULT_CHART_Y_AXIS, ...axes.y };
  }, [axes.y]);

  const animation = derived(() => {
    return merged.animation !== false && !prefersReducedMotion();
  });

  const renderOptions = useMemo((): null | ChartRenderOptions => {
    if (isNil(theme)) {
      return null;
    }

    return {
      xAxis,
      yAxis,
      theme,
      animation,
      categories,
      width: plotSize.width,
      height: plotSize.height,
      series: visibleSeries.map((item) => {
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
  }, [
    xAxis,
    yAxis,
    theme,
    animation,
    categories,
    visibleSeries,
    plotSize.width,
    plotSize.height,
  ]);

  const isReady = !isNil(hostEl) && !isNil(renderOptions);

  useLayoutEffect(() => {
    renderOptionsRef.current = renderOptions;
  }, [renderOptions]);

  useLayoutEffect(() => {
    const options = renderOptionsRef.current;

    if (!isReady || isNil(hostEl) || isNil(options)) {
      return;
    }

    // Host lives outside React's child fiber so engine DOM survives re-renders.
    const host = document.createElement("div");
    host.className = "absolute inset-0";
    hostEl.appendChild(host);

    const handle = mountEchartsChart({
      ...options,
      element: host,
      onActiveIndexChange,
    });

    handleRef.current = handle;
    renderedOptionsRef.current = options;

    return () => {
      handle.destroy();
      handleRef.current = null;
      renderedOptionsRef.current = null;
      host.remove();
    };
  }, [hostEl, isReady, onActiveIndexChange]);

  useLayoutEffect(() => {
    const handle = handleRef.current;

    if (
      isNil(handle) ||
      isNil(renderOptions) ||
      renderedOptionsRef.current === renderOptions
    ) {
      return;
    }

    renderedOptionsRef.current = renderOptions;
    handle.update(renderOptions);
  }, [renderOptions]);

  useEffect(() => {
    if (active.source === "keyboard") {
      handleRef.current?.setActiveIndex(active.index);
    }
  }, [active]);

  const tooltipItems = useMemo(() => {
    if (isNil(active.index)) {
      return [];
    }

    return getChartTooltipItems({
      index: active.index,
      series: visibleSeries.map((item) => {
        return { ...item, color: item.resolvedColor };
      }),
    });
  }, [active.index, visibleSeries]);

  const getTooltipAnchor = useCallback(
    (index: number) => {
      const anchor = handleRef.current?.getCategoryAnchor(index);

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

  const contextValue = useMemo((): ChartContextValue => {
    return {
      series,
      locale,
      setAxis,
      getBounds,
      categories,
      removeAxis,
      id: chartId,
      removeSeries,
      toggleSeries,
      tooltipItems,
      upsertSeries,
      highlightSeries,
      getTooltipAnchor,
      activeIndex: active.index,
      tokenClasses: {
        legend: get(sizeItem, "legend"),
        swatch: get(sizeItem, "swatch"),
        tooltip: get(sizeItem, "tooltip"),
        legendItem: get(sizeItem, "legendItem"),
      },
    };
  }, [
    series,
    locale,
    chartId,
    setAxis,
    sizeItem,
    getBounds,
    categories,
    removeAxis,
    removeSeries,
    toggleSeries,
    tooltipItems,
    upsertSeries,
    active.index,
    highlightSeries,
    getTooltipAnchor,
  ]);

  const isLoading = derived(() => {
    return componentProps.loading === true;
  });

  const isEmpty = derived(() => {
    return !isLoading && isChartEmpty(entries);
  });

  const emptyMessage = resolveMessage("No data");

  const summary = derived(() => {
    if (!isNil(componentProps.summary)) {
      return componentProps.summary;
    }

    if (isChartEmpty(entries)) {
      return emptyMessage;
    }

    return resolveMessage(
      "Chart with {{count}} series ({{names}}) across {{categories}} categories, from {{first}} to {{last}}.",
      getChartSummaryParams({ categories, series: entries }),
    );
  });

  const announcement = derived(() => {
    if (active.source !== "keyboard" || isNil(active.index)) {
      return "";
    }

    return formatChartAnnouncement({
      locale,
      items: tooltipItems,
      category: categories[active.index] ?? "",
    });
  });

  const table = derived(() => {
    return {
      categoryLabel: resolveMessage("Category"),
      series: entries.map((entry) => {
        return { id: entry.id, name: entry.name };
      }),
      rows: getChartTableRows({ categories, series: entries }).map((row) => {
        return {
          category: row.category,
          values: row.values.map((value) => {
            return isNil(value) ? "—" : formatChartValue(value, locale);
          }),
        };
      }),
    };
  });

  const onPlotKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    customProps?.plot?.onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const next = getAdjacentChartIndex({
      key: event.key,
      current: active.index,
      count: categories.length,
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
          getAdjacentChartIndex({
            key,
            current: previous.index,
            count: categories.length,
          }) ?? null,
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

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children", "style"]);
  });

  const rootBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return mergePartBind(
      omit(customProps?.root, ["style"]),
      rootInheritedAttrs,
      {
        ref: setRootEl,
        role: "figure",
        style: {
          width: toChartCssSize(componentProps.width, "100%"),
          ...inheritedAttrs.style,
          ...customProps?.root?.style,
        },
        className: cn({
          "relative flex min-w-0 flex-col gap-3": true,
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
        "aria-label": summary,
        onKeyDown: onPlotKeyDown,
        style: {
          height: toChartCssSize(merged.height, `${DEFAULT_CHART_HEIGHT}px`),
          ...customProps?.plot?.style,
        },
        className: cn({
          "relative w-full min-w-0 rounded-md outline-none": true,
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

  const loadingBind = derived((): HTMLAttributes<HTMLDivElement> => {
    return {
      className: cn({
        "absolute inset-0 z-10 flex": true,
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
        "sr-only": true,
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
    slots,
    merged,
    isEmpty,
    summary,
    children,
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
