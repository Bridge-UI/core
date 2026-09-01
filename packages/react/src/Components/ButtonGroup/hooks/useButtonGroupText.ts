// ** External Imports
import { useMemo } from "react";

// ** Core Imports
import { buttonGroupTextProps as textProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ButtonGroupTextClasses,
  ButtonGroupTextOwnProps,
  ButtonGroupTextProps,
} from "@/Components/ButtonGroup/buttonGroup.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonGroupTextBridgeKeys = [
  "as",
  "classes",
  "customProps",
] as const satisfies readonly (keyof ButtonGroupTextOwnProps)[];

type ButtonGroupTextLibDefaults = LibDefaultsShape<
  ButtonGroupTextOwnProps,
  "as"
>;

type ButtonGroupTextMerged = MergeLibDefaults<
  ButtonGroupTextOwnProps,
  ButtonGroupTextLibDefaults
>;

/**
 * Builds bind props for static text inside a button group.
 */
export function useButtonGroupText(
  props: ButtonGroupTextProps,
  libDefaults: ButtonGroupTextLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    ButtonGroupTextProps,
    typeof buttonGroupTextBridgeKeys
  >({
    props,
    bridgeKeys: buttonGroupTextBridgeKeys,
  });

  const { merged, entry: bridgeButtonGroupText } = useBridgeUIComponent<
    ButtonGroupTextMerged,
    "ButtonGroupText"
  >({
    libDefaults,
    props: componentProps,
    componentName: "ButtonGroupText",
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<ButtonGroupTextClasses>({
      props: componentProps,
      entry: bridgeButtonGroupText,
    });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const children = derived(() => {
    return props.children;
  });

  const tag = derived(() => {
    return merged.as ?? "span";
  });

  const textItem = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      textProps,
      bridgeButtonGroupText?.tokens?.text,
    );
  }, [bridgeButtonGroupText?.tokens?.text]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, inheritedAttrs, {
      className: cn({
        [textItem.root ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    });
  });

  return {
    tag,
    merged,
    children,
    rootBind,
  };
}
