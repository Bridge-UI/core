// ** External Imports
import { isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import {
  cn,
  sortTimeRangeValue,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
  type TimeRangeValue,
  type TimeValue,
} from "@bridge-ui/core";

// ** Local Imports
import { useDateAdapter, useDateAdapterContext } from "@/Adapters/Date";
import { useResolveMessage } from "@/Adapters/I18n";
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
  "value",
  "tokens",
  "classes",
  "maxTime",
  "minTime",
  "rounded",
  "disabled",
  "interval",
  "readOnly",
  "timeZone",
  "showFooter",
  "customProps",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimeRangePickerOwnProps)[];

type TimeRangePickerLibDefaults = LibDefaultsShape<
  TimeRangePickerOwnProps,
  "ampm" | "color" | "rounded" | "interval" | "showFooter"
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
  const resolveContext = useDateAdapterContext();
  const resolveMessage = useResolveMessage();

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
    return omit(inheritedAttrs, ["onCancel", "onChange"]);
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
  };

  const handleCancel = () => {
    setDraftValue(committedValue);
    props.onCancel?.();
  };

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      rootInheritedAttrs,
      cn({
        "flex flex-col overflow-hidden rounded-lg bg-white p-2 shadow-lg dark:bg-gray-900": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const panelsBind = derived(() => {
    return mergePartBind(
      customProps?.panels,
      {},
      cn({
        "flex flex-row gap-2": true,
        [mergedClasses.panels ?? ""]: true,
      }),
    );
  });

  const startBind = derived(() => {
    return mergePartBind(
      customProps?.start,
      {},
      cn({
        [mergedClasses.start ?? ""]: true,
      }),
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      customProps?.end,
      {},
      cn({
        [mergedClasses.end ?? ""]: true,
      }),
    );
  });

  const footerBind = derived(() => {
    return mergePartBind(
      customProps?.footer,
      {},
      cn({
        "flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950/40": true,
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
    endDisplayValue,
    handleEndChange,
    startDisplayValue,
    handleStartChange,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
