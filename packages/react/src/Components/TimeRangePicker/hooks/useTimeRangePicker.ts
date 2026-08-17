// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

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
import { useFieldOverlayFooter } from "@/Components/FieldOverlay/FieldOverlayContext";
import type {
  TimeRangePickerClasses,
  TimeRangePickerOwnProps,
  TimeRangePickerProps,
} from "@/Components/TimeRangePicker/timeRangePicker.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const timeRangePickerBridgeKeys = [
  "ampm",
  "color",
  "error",
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
  "ampm" | "color" | "rounded" | "interval" | "orientation" | "showSeconds"
>;

type TimeRangePickerMerged = MergeLibDefaults<
  TimeRangePickerOwnProps,
  TimeRangePickerLibDefaults
>;

export function useTimeRangePicker(
  props: TimeRangePickerProps,
  libDefaults: TimeRangePickerLibDefaults,
) {
  const adapter = useDateAdapter();
  const resolveMessage = useResolveMessage();
  const overlayFooter = useFieldOverlayFooter();
  const resolveContext = useDateAdapterContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TimeRangePickerProps,
    typeof timeRangePickerBridgeKeys
  >({
    props,
    bridgeKeys: timeRangePickerBridgeKeys,
  });

  const { merged, entry: bridgeTimeRangePicker } = useBridgeUIComponent<
    TimeRangePickerMerged,
    "TimeRangePicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "TimeRangePicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onApply", "onCancel", "onChange"]);
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<TimeRangePickerClasses>({
      props: componentProps,
      entry: bridgeTimeRangePicker,
    });

  const context = derived(() => {
    return resolveContext(merged.timeZone);
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] =
    useState<null | TimeRangeValue>(() => merged.defaultValue ?? null);

  const committedValue = derived((): null | TimeRangeValue => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const [draftValue, setDraftValue] = useState<null | TimeRangeValue>(
    committedValue,
  );

  useEffect(() => {
    if (merged.showFooter) {
      setDraftValue(committedValue);
    }
  }, [committedValue, merged.showFooter]);

  const displayValue = derived(() => {
    return merged.showFooter ? draftValue : committedValue;
  });

  const startDisplayValue = derived((): TimeValue => {
    return displayValue?.[0] ?? adapter.now(context);
  });

  const endDisplayValue = derived((): TimeValue => {
    return displayValue?.[1] ?? adapter.now(context);
  });

  const timeTokens = derived(() => {
    return {
      color: merged.tokens?.time?.color ?? merged.tokens?.color,
      rounded: merged.tokens?.time?.rounded ?? merged.tokens?.rounded,
    };
  });

  const commitValue = (next: null | TimeRangeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const applyRange = (next: TimeRangeValue) => {
    const sorted = sortTimeRangeValue(next, adapter, context);

    if (merged.showFooter) {
      setDraftValue(sorted);

      return;
    }

    commitValue(sorted);
  };

  const handleStartChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      return;
    }

    const end = displayValue?.[1] ?? adapter.now(context);

    applyRange([next, end]);
  };

  const handleEndChange = (next: null | TimeValue) => {
    if (isNil(next)) {
      return;
    }

    const start = displayValue?.[0] ?? adapter.now(context);

    applyRange([start, next]);
  };

  const handleApply = () => {
    commitValue(draftValue);
    props.onApply?.();
    overlayFooter.apply();
  };

  const handleCancel = () => {
    setDraftValue(committedValue);
    props.onCancel?.();
    overlayFooter.cancel();
  };

  const rootBind = derived(() => {
    const shellRounded = get(shellRoundedProps, merged.rounded ?? "md");

    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex w-fit flex-col overflow-hidden bg-white shadow-lg dark:bg-dark-900": true,
        [shellRounded]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const isVertical = derived(() => {
    return merged.orientation === "vertical";
  });

  const panelsBind = derived(() => {
    return mergePartBind(
      customProps?.panels,
      {},
      cn({
        "flex w-full gap-2 px-2.5": true,
        "flex-row": !isVertical,
        "flex-col": isVertical,
        [mergedClasses.panels ?? ""]: true,
      }),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        "flex min-w-0 flex-1 flex-col gap-1": true,
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        "flex min-w-0 flex-1 flex-col gap-1": true,
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const titleClass = derived(() => {
    return cn({
      "px-2 py-2 text-center text-xs font-medium tracking-wide text-dark-500 uppercase dark:text-dark-400": true,
    });
  });

  const startTitleBind = derived(() => {
    return cn({
      [titleClass]: true,
      [mergedClasses.startTitle ?? ""]: true,
    });
  });

  const endTitleBind = derived(() => {
    return cn({
      [titleClass]: true,
      [mergedClasses.endTitle ?? ""]: true,
    });
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-dark-100 bg-dark-50 px-3 py-2 dark:border-dark-800 dark:bg-dark-950/40": true,
        [mergedClasses.footer ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    endBind,
    rootBind,
    startBind,
    footerBind,
    panelsBind,
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
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
    endTitle: merged.endTitle ?? resolveMessage("End time"),
    startTitle: merged.startTitle ?? resolveMessage("Start time"),
  };
}
