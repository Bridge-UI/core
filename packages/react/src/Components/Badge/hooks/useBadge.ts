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
import {
  densityProps,
  roundedProps,
  variantProps,
} from "@bridge-ui/core/Components/Badge";

// ** Local Imports
import type {
  BadgeClasses,
  BadgeOwnProps,
  BadgeProps,
} from "@/Components/Badge/badge.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const badgeBridgeKeys = [
  "full",
  "size",
  "color",
  "classes",
  "density",
  "rounded",
  "variant",
] as const satisfies readonly (keyof BadgeOwnProps)[];

type BadgeLibDefaults = LibDefaultsShape<
  BadgeOwnProps,
  "size" | "color" | "density" | "rounded" | "variant"
>;

type BadgeMerged = MergeLibDefaults<BadgeOwnProps, BadgeLibDefaults>;

export function useBadge(props: BadgeProps, libDefaults: BadgeLibDefaults) {
  // Setup
  const { customProps, inheritedAttrs } = splitComponentProps<
    BadgeProps,
    typeof badgeBridgeKeys
  >({
    props,
    bridgeKeys: badgeBridgeKeys,
  });

  const { entry: bridgeBadge, merged } = useBridgeUIComponent<
    BadgeMerged,
    "Badge"
  >({
    libDefaults,
    props: customProps,
    componentName: "Badge",
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children"]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<BadgeClasses>({
    entry: bridgeBadge,
    props: customProps,
  });

  // Elements
  const isMini = derived(() => {
    return merged.density === "mini";
  });

  // Classes
  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeBadge?.customProps?.density,
    );

    return get(classes, [merged.density, merged.size]);
  }, [merged.size, merged.density, bridgeBadge?.customProps?.density]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge?.customProps?.variant,
    );

    return get(classes, [merged.variant, merged.color]);
  }, [merged.color, merged.variant, bridgeBadge?.customProps?.variant]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeBadge?.customProps?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeBadge?.customProps?.rounded]);

  // Binds
  // prettier-ignore
  const rootBind = derived(() => {
    return mergePartBind({}, rootInheritedAttrs, cn({
      // Theme classes
      "inline-flex items-center justify-center font-medium whitespace-nowrap": true,
      [get(colorClass, "background") ?? ""]: true,
      [get(colorClass, "border") ?? ""]: true,
      [get(colorClass, "text") ?? ""]: true,
      "w-full": !isMini && merged.full,
      "w-fit": !isMini && !merged.full,
      [roundedClass ?? ""]: true,
      [sizeClass ?? ""]: true,
      // Custom classes
      [mergedClasses.root ?? ""]: true,
    }));
  });

  return {
    merged,
    children,
    rootBind,
  };
}
