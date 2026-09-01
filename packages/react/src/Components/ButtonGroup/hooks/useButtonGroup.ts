// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { buttonGroupOrientationProps as orientationProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import {
  useButtonGroupContext,
  type ButtonGroupContextValue,
} from "@/Components/ButtonGroup/ButtonGroupContext";
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
  "size",
  "color",
  "classes",
  "density",
  "rounded",
  "variant",
  "separator",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ButtonGroupOwnProps)[];

type ButtonGroupLibDefaults = LibDefaultsShape<
  ButtonGroupOwnProps,
  "full" | "color" | "variant" | "separator" | "orientation"
>;

type ButtonGroupMerged = MergeLibDefaults<
  ButtonGroupOwnProps,
  ButtonGroupLibDefaults
>;

/**
 * Builds bind props for a grouped set of action buttons.
 */
export function useButtonGroup(
  props: ButtonGroupProps,
  libDefaults: ButtonGroupLibDefaults,
) {
  const parentGroup = useButtonGroupContext();

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

  const orientationItem = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeButtonGroup?.tokens?.orientation,
    );

    return get(classes, merged.orientation);
  }, [merged.orientation, bridgeButtonGroup?.tokens?.orientation]);

  const contextValue = useMemo((): ButtonGroupContextValue => {
    const registryDefaults = bridgeButtonGroup?.defaultProps;

    return {
      size: componentProps.size ?? registryDefaults?.size ?? parentGroup?.size,
      color:
        componentProps.color ?? registryDefaults?.color ?? parentGroup?.color,
      density:
        componentProps.density ??
        registryDefaults?.density ??
        parentGroup?.density,
      rounded:
        componentProps.rounded ??
        registryDefaults?.rounded ??
        parentGroup?.rounded,
      variant:
        componentProps.variant ??
        registryDefaults?.variant ??
        parentGroup?.variant,
    };
  }, [
    parentGroup,
    componentProps.size,
    componentProps.color,
    componentProps.density,
    componentProps.rounded,
    componentProps.variant,
    bridgeButtonGroup?.defaultProps,
  ]);

  const rootBind = derived(() => {
    const separatorOn = merged.separator === true;

    return mergePartBind(customProps?.root, inheritedAttrs, {
      role: "group",
      "data-slot": "button-group",
      className: cn({
        [get(orientationItem, "root") ?? ""]: true,
        [get(orientationItem, "join") ?? ""]: !separatorOn,
        [get(orientationItem, "separator") ?? ""]: separatorOn,
        [mergedClasses.root ?? ""]: true,
        "w-full [&>*]:flex-1": merged.full === true,
      }),
    });
  });

  return {
    merged,
    children,
    rootBind,
    contextValue,
  };
}
