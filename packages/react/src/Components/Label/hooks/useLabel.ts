// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import { sizeProps } from "@bridge-ui/core/Components/Label";

// ** Local Imports
import type {
  LabelClasses,
  LabelOwnProps,
  LabelProps,
} from "@/Components/Label/label.types";
import {
  derived,
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

export function useLabel(props: LabelProps, libDefaults: LabelLibDefaults) {
  // Setup
  const { customProps, inheritedAttrs } = splitComponentProps<
    LabelProps,
    typeof labelBridgeKeys
  >({
    props,
    bridgeKeys: labelBridgeKeys,
  });

  const { merged, entry: bridgeLabel } = useBridgeUIComponent<
    LabelMerged,
    "Label"
  >({
    libDefaults,
    props: customProps,
    componentName: "Label",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LabelClasses>({
    entry: bridgeLabel,
    props: customProps,
  });

  // Classes
  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLabel?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeLabel?.customProps?.size]);

  // Binds
  const requiredBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        "text-error-500 dark:text-error-500 select-none": true,
        [mergedClasses.required ?? ""]: true,
      }),
    );
  });

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      rootInheritedAttrs,
      cn({
        "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
        "text-error-600 dark:text-error-400": merged.error,
        "text-gray-700 dark:text-gray-300": !merged.error,
        [sizeClass ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    children,
    rootBind,
    requiredBind,
  };
}
