// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  textSizeProps as sizeProps,
  textVariantProps as variantProps,
  textWeightProps as weightProps,
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
  TextClasses,
  TextOwnProps,
  TextProps,
} from "@/Components/Text/text.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const textBridgeKeys = [
  "as",
  "size",
  "color",
  "weight",
  "classes",
  "numeric",
  "variant",
  "truncate",
  "uppercase",
] as const satisfies readonly (keyof TextOwnProps)[];

type TextLibDefaults = LibDefaultsShape<
  TextOwnProps,
  "as" | "size" | "color" | "weight" | "variant"
>;

type TextMerged = MergeLibDefaults<TextOwnProps, TextLibDefaults>;

export function useText(props: TextProps, libDefaults: TextLibDefaults) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    TextProps,
    typeof textBridgeKeys
  >({
    props,
    bridgeKeys: textBridgeKeys,
  });

  const { merged, entry: bridgeText } = useBridgeUIComponent<
    TextMerged,
    "Text"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Text",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextClasses>({
    entry: bridgeText,
    props: componentProps,
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeText?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeText?.tokens?.size]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeText?.tokens?.variant,
    );

    return get(classes, [merged.variant, merged.color]);
  }, [merged.color, merged.variant, bridgeText?.tokens?.variant]);

  const weightClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      weightProps,
      bridgeText?.tokens?.weight,
    );

    return get(classes, merged.weight);
  }, [merged.weight, bridgeText?.tokens?.weight]);

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      rootInheritedAttrs,
      cn({
        [sizeClass ?? ""]: true,
        [weightClass ?? ""]: true,
        [colorClass ?? ""]: true,
        truncate: merged.truncate === true,
        "tabular-nums tracking-tight": merged.numeric === true,
        "uppercase tracking-wider": merged.uppercase === true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    children,
    rootBind,
  };
}
