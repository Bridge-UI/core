// ** External Imports
import type { ECharts } from "echarts/core";
import { get, isNil, isNumber } from "es-toolkit/compat";

// ** Core Imports
import type {
  ChartAnchor,
  ChartBaseRenderOptions,
  ChartPartRenderSlice,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import type { EchartsPlotFamily } from "@/Utils/Charts/echarts/plot";

/**
 * Render options with slices (pie, funnel).
 */
type PartOptions = ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] };

/**
 * Emphasizes slice `index` (`null` clears).
 */
function emphasize(chart: ECharts, index: null | number) {
  chart.dispatchAction({ seriesIndex: 0, type: "downplay" });

  if (!isNil(index) && index >= 0) {
    chart.dispatchAction({
      seriesIndex: 0,
      dataIndex: index,
      type: "highlight",
    });
  }
}

/**
 * Plot label formatter: the precomputed text of each slice.
 */
export function formatSliceLabel(slices: ChartPartRenderSlice[]) {
  return (params: unknown) => {
    return get(slices, [Number(get(params, "dataIndex")), "labelText"]) ?? "";
  };
}

/**
 * Item-trigger pieces shared by pie and funnel plots: one series whose data
 * index is the active index.
 */
export function createEchartsPartFamily<Options extends PartOptions>(
  build: EchartsPlotFamily<Options>["build"],
  getAnchor: (chart: ECharts, index: number) => null | ChartAnchor,
): EchartsPlotFamily<Options> {
  return {
    build,
    getAnchor: (chart, options, index) => {
      return index < 0 || index >= options.slices.length
        ? null
        : getAnchor(chart, index);
    },
    highlight: (chart, options, id) => {
      emphasize(
        chart,
        isNil(id) ? null : options.slices.findIndex((slice) => slice.id === id),
      );
    },
    attach: (chart, emit) => {
      chart.on("mouseover", (event: unknown) => {
        const dataIndex = get(event, "dataIndex");

        emit(isNumber(dataIndex) ? dataIndex : null);
      });

      chart.on("mouseout", () => {
        emit(null);
      });
    },
    showActive: (chart, _, index) => {
      emphasize(chart, index);

      if (isNil(index)) {
        chart.dispatchAction({ type: "hideTip" });
        return;
      }

      chart.dispatchAction({
        seriesIndex: 0,
        type: "showTip",
        dataIndex: index,
      });
    },
  };
}
