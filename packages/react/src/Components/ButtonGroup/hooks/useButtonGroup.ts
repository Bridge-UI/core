// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  buttonGroupColorProps as colorProps,
  buttonGroupOrientationProps as orientationProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ButtonGroupClasses,
  ButtonGroupOwnProps,
  ButtonGroupProps,
} from "@/Components/ButtonGroup/buttonGroup.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonGroupBridgeKeys = [
  "full",
  "color",
  "classes",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ButtonGroupOwnProps)[];

type ButtonGroupLibDefaults = LibDefaultsShape<
  ButtonGroupOwnProps,
  "full" | "color" | "orientation"
>;

type ButtonGroupMerged = MergeLibDefaults<
  ButtonGroupOwnProps,
  ButtonGroupLibDefaults
>;

/**
 * Builds bind props for a grouped set of action controls.
 */
export function useButtonGroup(
  props: ButtonGroupProps,
  libDefaults: ButtonGroupLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    ButtonGroupProps,
    typeof buttonGroupBridgeKeys
  >({
    props,
    bridgeKeys: buttonGroupBridgeKeys,
  });

  const { merged, entry: bridgeButtonGroup } = useBridgeUIComponent<
    ButtonGroupMerged,
    "ButtonGroup"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ButtonGroup",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonGroupClasses>({
    props: componentProps,
    entry: bridgeButtonGroup,
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const children = derived(() => {
    return props.children;
  });

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeButtonGroup?.tokens?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeButtonGroup?.tokens?.color]);

  const orientationItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeButtonGroup?.tokens?.orientation,
    );

    return get(classes, merged.orientation);
  }, [merged.orientation, bridgeButtonGroup?.tokens?.orientation]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, inheritedAttrs, {
      role: "group",
      "data-slot": "button-group",
      className: cn({
        [colorClass ?? ""]: true,
        [get(orientationItem, "root") ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
        "w-full [&>*]:flex-1": merged.full === true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
  };
}
