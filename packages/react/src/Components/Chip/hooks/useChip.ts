// ** External Imports
import { get } from "es-toolkit/compat";
import type { KeyboardEvent, MouseEvent } from "react";

// ** Core Imports
import { chipSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ChipClasses,
  ChipOwnProps,
  ChipProps,
} from "@/Components/Chip/chip.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export const chipBridgeKeys = [
  "size",
  "label",
  "classes",
  "disabled",
  "onDismiss",
  "clearLabel",
  "customProps",
  "dismissible",
] as const satisfies readonly (keyof ChipOwnProps)[];

type ChipLibDefaults = LibDefaultsShape<ChipOwnProps, "size">;

type ChipMerged = MergeLibDefaults<ChipOwnProps, ChipLibDefaults>;

export function useChip(props: ChipOwnProps, libDefaults: ChipLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    ChipProps,
    typeof chipBridgeKeys
  >({
    props,
    bridgeKeys: chipBridgeKeys,
  });

  const { merged, entry: bridgeChip } = useBridgeUIComponent<
    ChipMerged,
    "Chip"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Chip",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ChipClasses>({
    entry: bridgeChip,
    props: componentProps,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const sizeClasses = derived(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeChip?.tokens?.size,
    );

    return get(classes, merged.size ?? "md");
  });

  const clearIconSize = derived(() => {
    return sizeClasses?.clear ?? "md";
  });

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      inheritedAttrs,
      cn({
        "inline-flex max-w-full items-center bg-dark-100 text-dark-800 dark:bg-dark-700 dark:text-dark-100": true,
        "opacity-50 pointer-events-none": merged.disabled === true,
        [sizeClasses?.root ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const labelBind = derived(() => {
    return mergePartBind(
      customProps?.label,
      {},
      cn({
        truncate: true,
        [sizeClasses?.label ?? ""]: true,
        [mergedClasses.label ?? ""]: true,
      }),
    );
  });

  const clearBind = derived(() => {
    return mergePartBind(
      customProps?.clear,
      {
        role: "button",
        tabIndex: merged.disabled ? -1 : 0,
        "aria-label": merged.clearLabel ?? "Remove",
        "aria-disabled": merged.disabled ? true : undefined,
      },
      cn({
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-sm text-dark-400 transition-colors duration-150 hover:text-dark-700 dark:text-dark-500 dark:hover:text-dark-200": true,
        [mergedClasses.clear ?? ""]: true,
      }),
    );
  });

  function handleDismiss(event: MouseEvent | KeyboardEvent) {
    if (merged.disabled) {
      return;
    }

    merged.onDismiss?.(event);
  }

  function handleClearKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleDismiss(event);
    }
  }

  return {
    merged,
    rootBind,
    labelBind,
    clearBind,
    clearIconSize,
    mergedClasses,
    handleDismiss,
    handleClearKeyDown,
  };
}
