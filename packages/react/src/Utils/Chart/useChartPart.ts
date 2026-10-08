// ** External Imports
import { isNil } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  getChartPartTable,
  getChartPartTooltip,
  isChartPartEmpty,
  resolveChartSliceLabel,
  toChartSliceEntries,
  type ChartBaseRenderOptions,
  type ChartHandle,
  type ChartLabelContent,
  type ChartLabels,
  type ChartMountOptions,
  type ChartPartRenderSlice,
  type ChartSlice,
  type ChartSliceEntry,
} from "@bridge-ui/core/Domain";

// ** Local Imports
import {
  toChartLegendItems,
  useChartColors,
  useChartContextValue,
  useChartFrame,
  useChartPlot,
  type ChartRootState,
} from "@/Utils/Chart/useChartRoot";
import { useLatestCallback } from "@/Utils/Chart/useLatestCallback";

/**
 * Pie / funnel root: slices from `data`, percents, plot labels, and the
 * shared chart frame.
 */
export function useChartPart<
  Options extends ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] },
>(
  root: ChartRootState,
  {
    data,
    mount,
    order,
    family,
    labels,
    summary,
    percents,
    maxSlices,
    buildOptions,
    labelContent,
    positiveOnly,
  }: {
    buildOptions: (
      base: ChartBaseRenderOptions & { slices: ChartPartRenderSlice[] },
    ) => Options;
    data: readonly ChartSlice[];
    family: "pie" | "funnel";
    labelContent: undefined | ChartLabelContent;
    labels: ChartLabels;
    maxSlices?: number;
    mount: (options: ChartMountOptions<Options>) => ChartHandle<Options>;
    order?: (entries: ChartSliceEntry[]) => ChartSliceEntry[];
    percents: (values: readonly number[]) => number[];
    positiveOnly: boolean;
    summary: (slices: ChartPartRenderSlice[]) => string;
  },
) {
  const { theme, hidden, locale, active, plotSize, animation } = root;
  const { resolveMessage } = root;

  const otherLabel = resolveMessage("Other");
  const dataSignature = JSON.stringify(data ?? []);

  const content = useLatestCallback(
    typeof labelContent === "function" ? labelContent : undefined,
  );

  const contentKey = typeof labelContent === "function" ? null : labelContent;

  const entries = useMemo(() => {
    const parsed = toChartSliceEntries({
      maxSlices,
      otherLabel,
      positiveOnly,
      data: JSON.parse(dataSignature) as ChartSlice[],
    });

    return isNil(order) ? parsed : order(parsed);
  }, [dataSignature, maxSlices, otherLabel, positiveOnly, order]);

  const colors = useChartColors(root, entries);

  /** Every slice with its share of all data (table, summary). */
  const allSlices = useMemo((): ChartPartRenderSlice[] => {
    const shares = percents(entries.map((entry) => entry.value));

    return entries.map((entry, index) => {
      return {
        id: entry.id,
        labelText: "",
        label: entry.label,
        value: entry.value,
        percent: shares[index] ?? 0,
        color: colors[entry.id] ?? "",
      };
    });
  }, [entries, colors, percents]);

  /** Visible slices with shares of what is shown (plot, legend, tooltip). */
  const slices = useMemo((): ChartPartRenderSlice[] => {
    const visible = entries.filter((entry) => !hidden.includes(entry.id));
    const shares = percents(visible.map((entry) => entry.value));
    const format = content ?? contentKey ?? "label";

    return visible.map((entry, index) => {
      const percent = shares[index] ?? 0;

      return {
        percent,
        id: entry.id,
        label: entry.label,
        value: entry.value,
        color: colors[entry.id] ?? "",
        labelText:
          labels === false
            ? ""
            : resolveChartSliceLabel({
                locale,
                content: format,
                slice: { percent, label: entry.label, value: entry.value },
              }),
      };
    });
  }, [entries, hidden, colors, percents, labels, locale, content, contentKey]);

  const options = useMemo((): null | Options => {
    if (isNil(theme)) {
      return null;
    }

    return buildOptions({
      theme,
      slices,
      animation,
      width: plotSize.width,
      height: plotSize.height,
    });
  }, [theme, slices, animation, buildOptions, plotSize.width, plotSize.height]);

  useChartPlot(root, { mount, options });

  const tooltip = useMemo(() => {
    const slice = isNil(active.index) ? undefined : slices[active.index];

    return isNil(slice) ? null : getChartPartTooltip(slice);
  }, [active.index, slices]);

  const table = getChartPartTable({
    locale,
    slices: allSlices,
    headers: {
      value: resolveMessage("Value"),
      percent: resolveMessage("Share"),
      label: resolveMessage("Category"),
    },
  });

  const frame = useChartFrame(root, {
    table,
    tooltip,
    count: slices.length,
    summary: summary(allSlices),
    isEmpty: isChartPartEmpty(entries),
  });

  const legendItems = useMemo(() => {
    const percentById = new Map(slices.map((slice) => [slice.id, slice]));

    return toChartLegendItems(
      entries.map((entry) => {
        return {
          id: entry.id,
          name: entry.label,
          value: entry.value,
          percent: percentById.get(entry.id)?.percent,
        };
      }),
      colors,
      hidden,
    );
  }, [entries, slices, colors, hidden]);

  const context = useChartContextValue(root, {
    family,
    tooltip,
    legendItems,
  });

  return {
    frame,
    context,
    options,
  };
}
