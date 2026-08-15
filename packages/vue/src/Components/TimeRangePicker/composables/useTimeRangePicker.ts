// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import {
  computed,
  ref,
  toValue,
  useAttrs,
  watch,
  type MaybeRefOrGetter,
} from "vue";

// ** Core Imports
import {
  sortTimeRangeValue,
  type TimeRangeValue,
  type TimeValue,
} from "@bridge-ui/core/Domain";
import { menuRoundedProps as shellRoundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
import type {
  TimeRangePickerClasses,
  TimeRangePickerOwnProps,
} from "@/Components/TimeRangePicker/timeRangePicker.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const timeRangePickerBridgeKeys = [
  "ampm",
  "color",
  "value",
  "tokens",
  "classes",
  "maxTime",
  "minTime",
  "rounded",
  "disabled",
  "endTitle",
  "interval",
  "readOnly",
  "timeZone",
  "showFooter",
  "startTitle",
  "customProps",
  "orientation",
  "showSeconds",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeRangePickerOwnProps)[];

type TimeRangePickerLibDefaults = LibDefaultsShape<
  TimeRangePickerOwnProps,
  | "ampm"
  | "color"
  | "rounded"
  | "interval"
  | "showFooter"
  | "orientation"
  | "showSeconds"
>;

type TimeRangePickerMerged = MergeLibDefaults<
  TimeRangePickerOwnProps,
  TimeRangePickerLibDefaults
>;

/**
 * Owns controlled/uncontrolled range value, optional footer draft, and dual panel binds.
 */
export function useTimeRangePicker(
  props: MaybeRefOrGetter<TimeRangePickerOwnProps>,
  libDefaults: TimeRangePickerLibDefaults,
  emit: {
    (event: "change", value: null | TimeRangeValue): void;
    (event: "cancel"): void;
  },
) {
  const attrs = useAttrs();
  const adapter = useDateAdapter();
  const resolveContext = useDateAdapterContext();
  const resolveMessage = useResolveMessage();

  const split = computed(() => {
    return splitComponentProps<
      TimeRangePickerOwnProps,
      typeof timeRangePickerBridgeKeys
    >({
      bridgeKeys: timeRangePickerBridgeKeys,
      props: { ...attrs, ...toValue(props) },
    });
  });

  const { merged, entry: bridgeTimeRangePicker } = useBridgeUIComponent<
    TimeRangePickerMerged,
    "TimeRangePicker"
  >({
    libDefaults,
    componentName: "TimeRangePicker",
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const rootInheritedAttrs = computed(() => {
    return omit(split.value.inheritedAttrs, ["onChange", "onCancel"]);
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<TimeRangePickerClasses>({
      entry: bridgeTimeRangePicker,
      props: () => split.value.componentProps,
    });

  const propsValue = computed(() => {
    return toValue(props);
  });

  const context = computed(() => {
    return resolveContext(merged.value.timeZone);
  });

  const isControlled = computed(() => {
    return !isNil(propsValue.value.value);
  });

  const uncontrolledValue = ref<null | TimeRangeValue>(
    merged.value.defaultValue ?? null,
  );

  const committedValue = computed((): null | TimeRangeValue => {
    return isControlled.value
      ? (propsValue.value.value ?? null)
      : uncontrolledValue.value;
  });

  const draftValue = ref<null | TimeRangeValue>(committedValue.value);

  watch(
    () => [committedValue.value, merged.value.showFooter] as const,
    ([committed, showFooter]) => {
      if (showFooter) {
        draftValue.value = committed;
      }
    },
  );

  const displayValue = computed(() => {
    return merged.value.showFooter ? draftValue.value : committedValue.value;
  });

  const startDisplayValue = computed((): TimeValue => {
    return displayValue.value?.[0] ?? adapter.value.now(context.value);
  });

  const endDisplayValue = computed((): TimeValue => {
    return displayValue.value?.[1] ?? adapter.value.now(context.value);
  });

  const timeTokens = computed(() => {
    return {
      color: merged.value.tokens?.time?.color ?? merged.value.tokens?.color,
      rounded:
        merged.value.tokens?.time?.rounded ?? merged.value.tokens?.rounded,
    };
  });

  const commitValue = (next: null | TimeRangeValue) => {
    if (!isControlled.value) {
      uncontrolledValue.value = next;
    }

    emit("change", next);
  };

  const applyRange = (next: TimeRangeValue) => {
    const sorted = sortTimeRangeValue(next, adapter.value, context.value);

    if (merged.value.showFooter) {
      draftValue.value = sorted;

      return;
    }

    commitValue(sorted);
  };

  const handleStartChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      return;
    }

    const end = displayValue.value?.[1] ?? adapter.value.now(context.value);

    applyRange([next, end]);
  };

  const handleEndChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      return;
    }

    const start = displayValue.value?.[0] ?? adapter.value.now(context.value);

    applyRange([start, next]);
  };

  const handleApply = () => {
    commitValue(draftValue.value);
  };

  const handleCancel = () => {
    draftValue.value = committedValue.value;
    emit("cancel");
  };

  const rootBind = computed(() => {
    const shellRounded = get(shellRoundedProps, merged.value.rounded ?? "md");

    return mergePartBind(
      customProps.value?.root,
      rootInheritedAttrs.value,
      cn({
        "flex w-fit flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        [shellRounded]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  const isVertical = computed(() => {
    return merged.value.orientation === "vertical";
  });

  const panelsBind = computed(() => {
    return mergePartBind(
      customProps.value?.panels,
      {},
      cn({
        "flex w-full gap-2 px-2.5": true,
        "flex-row": !isVertical.value,
        "flex-col": isVertical.value,
        [mergedClasses.value.panels ?? ""]: true,
      }),
    );
  });

  const startBind = computed(() => {
    return mergePartBind(
      customProps.value?.start,
      {},
      cn({
        "flex min-w-0 flex-1 flex-col gap-1": true,
        [mergedClasses.value.start ?? ""]: true,
      }),
    );
  });

  const endBind = computed(() => {
    return mergePartBind(
      customProps.value?.end,
      {},
      cn({
        "flex min-w-0 flex-1 flex-col gap-1": true,
        [mergedClasses.value.end ?? ""]: true,
      }),
    );
  });

  const titleClass = computed(() => {
    return cn({
      "px-2 py-2 text-center text-xs font-medium tracking-wide text-dark-500 uppercase dark:text-dark-400": true,
    });
  });

  const startTitleBind = computed(() => {
    return cn({
      [titleClass.value]: true,
      [mergedClasses.value.startTitle ?? ""]: true,
    });
  });

  const endTitleBind = computed(() => {
    return cn({
      [titleClass.value]: true,
      [mergedClasses.value.endTitle ?? ""]: true,
    });
  });

  const footerBind = computed(() => {
    return mergePartBind(
      customProps.value?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.value.footer ?? ""]: true,
      }),
    );
  });

  const showFooter = computed(() => {
    return Boolean(merged.value.showFooter);
  });

  return {
    merged,
    endBind,
    rootBind,
    startBind,
    footerBind,
    panelsBind,
    showFooter,
    timeTokens,
    handleApply,
    displayValue,
    handleCancel,
    endTitleBind,
    startTitleBind,
    endDisplayValue,
    handleEndChange,
    startDisplayValue,
    handleStartChange,
    applyLabel: computed(() => {
      return resolveMessage("Apply");
    }),
    cancelLabel: computed(() => {
      return resolveMessage("Cancel");
    }),
    applyButtonProps: computed(() => {
      return customProps.value?.applyButton;
    }),
    cancelButtonProps: computed(() => {
      return customProps.value?.cancelButton;
    }),
    endTitle: computed(() => {
      return merged.value.endTitle ?? resolveMessage("End time");
    }),
    startTitle: computed(() => {
      return merged.value.startTitle ?? resolveMessage("Start time");
    }),
  };
}
