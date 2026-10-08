// ** External Imports
import { isNil } from "es-toolkit/compat";
import { computed } from "vue";

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

/**
 * Pie / funnel root: slices from `data`, percents, plot labels, and the
 * shared chart frame. Getters keep every input reactive.
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
    data: () => readonly ChartSlice[];
    family: "pie" | "funnel";
    labelContent: () => undefined | ChartLabelContent;
    labels: () => ChartLabels;
    maxSlices?: () => number | undefined;
    mount: (options: ChartMountOptions<Options>) => ChartHandle<Options>;
    order?: (entries: ChartSliceEntry[]) => ChartSliceEntry[];
    percents: (values: readonly number[]) => number[];
    positiveOnly: boolean;
    summary: (slices: ChartPartRenderSlice[]) => string;
  },
) {
  const { hidden, locale, resolveMessage } = root;

  const dataSignature = computed(() => {
    return JSON.stringify(data() ?? []);
  });

  const entries = computed(() => {
    const parsed = toChartSliceEntries({
      positiveOnly,
      maxSlices: maxSlices?.(),
      otherLabel: resolveMessage("Other"),
      data: JSON.parse(dataSignature.value) as ChartSlice[],
    });

    return isNil(order) ? parsed : order(parsed);
  });

  const colors = useChartColors(root, () => entries.value);

  /** Every slice with its share of all data (table, summary). */
  const allSlices = computed((): ChartPartRenderSlice[] => {
    const shares = percents(entries.value.map((entry) => entry.value));

    return entries.value.map((entry, index) => {
      return {
        id: entry.id,
        labelText: "",
        label: entry.label,
        value: entry.value,
        percent: shares[index] ?? 0,
        color: colors.value[entry.id] ?? "",
      };
    });
  });

  /** Visible slices with shares of what is shown (plot, legend, tooltip). */
  const slices = computed((): ChartPartRenderSlice[] => {
    const visible = entries.value.filter((entry) => {
      return !hidden.value.includes(entry.id);
    });

    const shares = percents(visible.map((entry) => entry.value));
    const content = labelContent() ?? "label";
    const placement = labels();

    return visible.map((entry, index) => {
      const percent = shares[index] ?? 0;

      return {
        percent,
        id: entry.id,
        label: entry.label,
        value: entry.value,
        color: colors.value[entry.id] ?? "",
        labelText:
          placement === false
            ? ""
            : resolveChartSliceLabel({
                content,
                locale: locale.value,
                slice: { percent, label: entry.label, value: entry.value },
              }),
      };
    });
  });

  const options = computed((): null | Options => {
    const theme = root.theme.value;

    if (isNil(theme)) {
      return null;
    }

    return buildOptions({
      theme,
      slices: slices.value,
      animation: root.animation.value,
      width: root.plotSize.value.width,
      height: root.plotSize.value.height,
    });
  });

  useChartPlot(root, { mount, options });

  const tooltip = computed(() => {
    const index = root.active.value.index;
    const slice = isNil(index) ? undefined : slices.value[index];

    return isNil(slice) ? null : getChartPartTooltip(slice);
  });

  const frame = useChartFrame(
    root,
    computed(() => {
      return {
        tooltip: tooltip.value,
        count: slices.value.length,
        summary: summary(allSlices.value),
        isEmpty: isChartPartEmpty(entries.value),
        table: getChartPartTable({
          locale: locale.value,
          slices: allSlices.value,
          headers: {
            value: resolveMessage("Value"),
            percent: resolveMessage("Share"),
            label: resolveMessage("Category"),
          },
        }),
      };
    }),
  );

  const context = useChartContextValue(
    root,
    computed(() => {
      const visible = new Map(slices.value.map((slice) => [slice.id, slice]));

      return {
        family,
        tooltip: tooltip.value,
        legendItems: toChartLegendItems(
          entries.value.map((entry) => {
            return {
              id: entry.id,
              name: entry.label,
              value: entry.value,
              percent: visible.get(entry.id)?.percent,
            };
          }),
          colors.value,
          hidden.value,
        ),
      };
    }),
  );

  return {
    frame,
    context,
    options,
  };
}
