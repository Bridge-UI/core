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
import { invalidatedProps, sizeProps } from "@bridge-ui/core/Components/Label";

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
  const { componentProps, inheritedAttrs } = splitComponentProps<
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
    props: componentProps,
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
    props: componentProps,
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLabel?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeLabel?.customProps?.size]);

  const invalidatedColors = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeLabel?.customProps?.invalidated,
    );
  }, [bridgeLabel?.customProps?.invalidated]);

  const requiredBind = derived(() => {
    return mergePartBind(
      {},
      {},
      cn({
        [invalidatedColors.required ?? ""]: true,
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
        "text-gray-700 dark:text-gray-300": !merged.error,
        [invalidatedColors.label ?? ""]: merged.error,
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
