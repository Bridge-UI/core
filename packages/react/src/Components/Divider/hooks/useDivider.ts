// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  orientationProps,
} from "@bridge-ui/core/Components/Divider";

// ** Local Imports
import type {
  DividerClasses,
  DividerOwnProps,
  DividerProps,
} from "@/Components/Divider/divider.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dividerBridgeKeys = [
  "color",
  "classes",
  "orientation",
] as const satisfies readonly (keyof DividerOwnProps)[];

type DividerLibDefaults = LibDefaultsShape<
  DividerOwnProps,
  "color" | "orientation"
>;

type DividerMerged = MergeLibDefaults<DividerOwnProps, DividerLibDefaults>;

export function useDivider(
  props: DividerProps,
  libDefaults: DividerLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    DividerProps,
    typeof dividerBridgeKeys
  >({
    props,
    bridgeKeys: dividerBridgeKeys,
  });

  const { merged, entry: bridgeDivider } = useBridgeUIComponent<
    DividerMerged,
    "Divider"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Divider",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<DividerClasses>({
    entry: bridgeDivider,
    props: componentProps,
  });

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeDivider?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeDivider?.customProps?.color]);

  const orientationClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeDivider?.customProps?.orientation,
    );

    return get(classes, merged.orientation);
  }, [merged.orientation, bridgeDivider?.customProps?.orientation]);

  const rootBind = derived(() => {
    return mergePartBind({}, inheritedAttrs, {
      role: "separator",
      "aria-orientation": merged.orientation,
      className: cn({
        "m-0 shrink-0 border-0": true,
        [colorClass ?? ""]: true,
        [orientationClass ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
