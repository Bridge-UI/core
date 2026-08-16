// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useEffect, useState } from "react";

// ** Core Imports
import type { TimeValue } from "@bridge-ui/core/Domain";
import { menuRoundedProps as shellRoundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import { useResolveMessage } from "@/Adapters/I18n";
import { useFieldOverlayFooter } from "@/Components/FieldOverlay/FieldOverlayContext";
import type {
  TimePickerClasses,
  TimePickerOwnProps,
  TimePickerProps,
} from "@/Components/TimePicker/timePicker.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const timePickerBridgeKeys = [
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
  "showSeconds",
  "defaultValue",
  "disableTimes",
] as const satisfies readonly (keyof TimePickerOwnProps)[];

type TimePickerLibDefaults = LibDefaultsShape<
  TimePickerOwnProps,
  "ampm" | "color" | "rounded" | "interval" | "showSeconds"
>;

type TimePickerMerged = MergeLibDefaults<
  TimePickerOwnProps,
  TimePickerLibDefaults
>;

export function useTimePicker(
  props: TimePickerProps,
  libDefaults: TimePickerLibDefaults,
) {
  const resolveMessage = useResolveMessage();
  const overlayFooter = useFieldOverlayFooter();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    TimePickerProps,
    typeof timePickerBridgeKeys
  >({
    props,
    bridgeKeys: timePickerBridgeKeys,
  });

  const { merged, entry: bridgeTimePicker } = useBridgeUIComponent<
    TimePickerMerged,
    "TimePicker"
  >({
    libDefaults,
    props: componentProps,
    componentName: "TimePicker",
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["onApply", "onCancel", "onChange"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TimePickerClasses>({
    props: componentProps,
    entry: bridgeTimePicker,
  });

  const isControlled = derived(() => {
    return !isNil(props.value);
  });

  const [uncontrolledValue, setUncontrolledValue] = useState<null | TimeValue>(
    () => merged.defaultValue ?? null,
  );

  const committedValue = derived((): null | TimeValue => {
    return isControlled ? (props.value ?? null) : uncontrolledValue;
  });

  const [draftValue, setDraftValue] = useState<null | TimeValue>(
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

  const timeTokens = derived(() => {
    return {
      color: merged.tokens?.time?.color ?? merged.tokens?.color,
      rounded: merged.tokens?.time?.rounded ?? merged.tokens?.rounded,
    };
  });

  const commitValue = (next: null | TimeValue) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }

    props.onChange?.(next);
  };

  const handlePanelChange = (next: null | TimeValue) => {
    if (merged.showFooter) {
      setDraftValue(next);

      return;
    }

    commitValue(next);
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

  const contentBind = derived(() => {
    return cn({
      "px-2.5": true,
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
    rootBind,
    footerBind,
    timeTokens,
    contentBind,
    handleApply,
    displayValue,
    handleCancel,
    handlePanelChange,
    applyLabel: resolveMessage("Apply"),
    cancelLabel: resolveMessage("Cancel"),
    showFooter: Boolean(merged.showFooter),
    applyButtonProps: customProps?.applyButton,
    cancelButtonProps: customProps?.cancelButton,
  };
}
