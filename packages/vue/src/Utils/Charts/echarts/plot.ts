/**
 * ECharts plot mounted into a host node owned by a chart root.
 * Framework-agnostic: `echarts/core` `init` against a DOM element.
 * Legend, tooltip content, and a11y stay in Bridge — the ECharts tooltip
 * only drives the pointer (`showContent: false`).
 */

// ** External Imports
import { init, type ECharts, type EChartsCoreOption } from "echarts/core";
import { get, isFunction, isNil } from "es-toolkit/compat";

// ** Core Imports
import type {
  ChartAnchor,
  ChartBaseRenderOptions,
  ChartHandle,
  ChartMountOptions,
  ChartRenderTheme,
} from "@bridge-ui/core/Domain";

/**
 * Family-specific pieces of a plot.
 */
export type EchartsPlotFamily<Options extends ChartBaseRenderOptions> = {
  /**
   * Wires pointer events to `emit` (the active index, `null` on leave).
   */
  attach: (
    chart: ECharts,
    emit: (index: null | number) => void,
    getOptions: () => Options,
  ) => void;

  /**
   * Builds the ECharts option.
   */
  build: (options: Options) => EChartsCoreOption;

  /**
   * Tooltip anchor for the item at `index`.
   */
  getAnchor: (
    chart: ECharts,
    options: Options,
    index: number,
  ) => null | ChartAnchor;

  /**
   * Emphasizes a legend item (`null` clears).
   */
  highlight: (chart: ECharts, options: Options, id: null | string) => void;

  /**
   * Shows the pointer for keyboard navigation (`null` clears).
   */
  showActive: (chart: ECharts, options: Options, index: null | number) => void;
};

/**
 * Label style shared by axes and plot labels.
 */
export function labelStyle(theme: ChartRenderTheme) {
  return {
    color: theme.textColor,
    fontSize: theme.fontSize,
    fontFamily: theme.fontFamily,
  };
}

/**
 * Item layout computed by ECharts for a single-series plot (pie slice
 * sector, funnel trapezoid). Reads the internal model; `null` when missing.
 */
export function readItemLayout(
  chart: ECharts,
  dataIndex: number,
): null | Record<string, unknown> {
  const getModel = get(chart, "getModel") as unknown;

  if (!isFunction(getModel)) {
    return null;
  }

  const model = getModel.call(chart) as {
    getSeriesByIndex?: (index: number) =>
      | undefined
      | {
          getData?: () => { getItemLayout?: (index: number) => unknown };
        };
  };

  const layout = model
    ?.getSeriesByIndex?.(0)
    ?.getData?.()
    ?.getItemLayout?.(dataIndex);

  return isNil(layout) ? null : (layout as Record<string, unknown>);
}

/**
 * Mounts a plot into `options.element` and returns its handle.
 */
export function mountEchartsPlot<Options extends ChartBaseRenderOptions>(
  options: ChartMountOptions<Options>,
  family: EchartsPlotFamily<Options>,
): ChartHandle<Options> {
  let current: Options = options;
  let chart: null | ECharts = null;
  let lastIndex: null | number = null;
  let silent = false;

  const emit = (index: null | number) => {
    if (silent || index === lastIndex) {
      return;
    }

    lastIndex = index;
    options.onActiveIndexChange(index);
  };

  const ensureChart = (): null | ECharts => {
    if (!isNil(chart)) {
      return chart;
    }

    // ECharts measures the DOM when width / height are 0; wait for a size.
    if (current.width <= 0 || current.height <= 0) {
      return null;
    }

    chart = init(options.element, null, {
      renderer: "svg",
      width: current.width,
      height: current.height,
    });

    family.attach(chart, emit, () => current);

    chart.getZr().on("globalout", () => {
      emit(null);
    });

    return chart;
  };

  const render = () => {
    const instance = ensureChart();

    if (isNil(instance)) {
      return;
    }

    const { width, height } = current;

    if (instance.getWidth() !== width || instance.getHeight() !== height) {
      instance.resize({ width, height });
    }

    instance.setOption(family.build(current), { replaceMerge: ["series"] });
  };

  render();

  return {
    update: (next) => {
      current = next;
      render();
    },
    destroy: () => {
      chart?.dispose();
      chart = null;
    },
    getAnchor: (index) => {
      return isNil(chart) ? null : family.getAnchor(chart, current, index);
    },
    highlight: (id) => {
      if (!isNil(chart)) {
        family.highlight(chart, current, id);
      }
    },
    setActiveIndex: (index) => {
      if (isNil(chart)) {
        return;
      }

      silent = true;
      lastIndex = index;
      family.showActive(chart, current, index);
      silent = false;
    },
  };
}
