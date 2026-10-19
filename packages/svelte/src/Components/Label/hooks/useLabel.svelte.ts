// ** External Imports
import { get } from "es-toolkit/compat";

// ** Core Imports
import { labelSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  LabelClasses,
  LabelOwnProps,
  LabelProps,
} from "@/Components/Label/label.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const labelBridgeKeys = [
  "size",
  "error",
  "classes",
  "required",
] as const satisfies readonly (keyof LabelOwnProps)[];

type LabelLibDefaults = LibDefaultsShape<LabelOwnProps, "size">;

type LabelMerged = MergeLibDefaults<LabelOwnProps, LabelLibDefaults>;

export function useLabel(
  props: () => LabelProps,
  libDefaults: LabelLibDefaults,
) {
  const split = $derived.by(() => {
    return splitComponentProps<LabelProps, typeof labelBridgeKeys>({
      bridgeKeys: labelBridgeKeys,
      props: { ...props() },
    });
  });

  const bridgeLabel = useBridgeUIComponent<LabelMerged, "Label">({
    libDefaults,
    componentName: "Label",
    props: () => split.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LabelClasses>(() => {
    return {
      entry: bridgeLabel.entry,
      props: split.componentProps,
    };
  });

  const sizeClass = $derived.by(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLabel.entry?.tokens?.size,
    );

    return get(classes, bridgeLabel.merged.size);
  });

  const requiredBind = $derived.by(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-error-500 dark:text-error-500 select-none": true,
        [mergedClasses().required ?? ""]: true,
      }),
    );
  });

  const rootBind = $derived.by(() => {
    return mergePartBind(
      {},
      split.inheritedAttrs,
      cn({
        "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
        "text-dark-700 dark:text-dark-300": !bridgeLabel.merged.error,
        "text-error-600 dark:text-error-400": bridgeLabel.merged.error,
        [sizeClass ?? ""]: true,
        [mergedClasses().root ?? ""]: true,
      }),
    );
  });

  return {
    get merged() {
      return bridgeLabel.merged;
    },
    get rootBind() {
      return rootBind;
    },
    get requiredBind() {
      return requiredBind;
    },
  };
}
