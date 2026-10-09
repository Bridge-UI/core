// ** External Imports
import { get, isNil, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  headingLevelProps as levelProps,
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
  HeadingClasses,
  HeadingOwnProps,
  HeadingProps,
} from "@/Components/Heading/heading.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const headingBridgeKeys = [
  "size",
  "color",
  "level",
  "weight",
  "classes",
  "variant",
] as const satisfies readonly (keyof HeadingOwnProps)[];

type HeadingLibDefaults = LibDefaultsShape<
  HeadingOwnProps,
  "color" | "level" | "weight" | "variant"
>;

type HeadingMerged = MergeLibDefaults<HeadingOwnProps, HeadingLibDefaults>;

export function useHeading(
  props: HeadingProps,
  libDefaults: HeadingLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    HeadingProps,
    typeof headingBridgeKeys
  >({
    props,
    bridgeKeys: headingBridgeKeys,
  });

  const { merged, entry: bridgeHeading } = useBridgeUIComponent<
    HeadingMerged,
    "Heading"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Heading",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<HeadingClasses>({
    entry: bridgeHeading,
    props: componentProps,
  });

  const rootTag = derived(() => {
    return `h${merged.level}` as const;
  });

  const sizeClass = useMemo(() => {
    if (isNil(merged.size)) {
      const classes = mergeBridgeUILayeredClasses(
        levelProps,
        bridgeHeading?.tokens?.level,
      );

      return get(classes, String(merged.level));
    }

    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeHeading?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [
    merged.size,
    merged.level,
    bridgeHeading?.tokens?.size,
    bridgeHeading?.tokens?.level,
  ]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeHeading?.tokens?.variant,
    );

    return get(classes, [merged.variant, merged.color]);
  }, [merged.color, merged.variant, bridgeHeading?.tokens?.variant]);

  const weightClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      weightProps,
      bridgeHeading?.tokens?.weight,
    );

    return get(classes, merged.weight);
  }, [merged.weight, bridgeHeading?.tokens?.weight]);

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      rootInheritedAttrs,
      cn({
        "tracking-tight": true,
        [sizeClass ?? ""]: true,
        [weightClass ?? ""]: true,
        [colorClass ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootTag,
    children,
    rootBind,
  };
}
