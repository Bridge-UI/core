// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  badgeDensityProps as densityProps,
  badgeRoundedProps as roundedProps,
  badgeVariantProps as variantProps,
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
  const { componentProps, inheritedAttrs } = splitComponentProps<
    BadgeProps,
    typeof badgeBridgeKeys
  >({
    props,
    bridgeKeys: badgeBridgeKeys,
  });

  const { merged, entry: bridgeBadge } = useBridgeUIComponent<
    BadgeMerged,
    "Badge"
  >({
    libDefaults,
    props: componentProps,
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
    props: componentProps,
  });

  const isMini = derived(() => {
    return merged.density === "mini";
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeBadge?.tokens?.density,
    );

    return get(classes, [merged.density, merged.size]);
  }, [merged.size, merged.density, bridgeBadge?.tokens?.density]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge?.tokens?.variant,
    );

    return get(classes, [merged.variant, merged.color]);
  }, [merged.color, merged.variant, bridgeBadge?.tokens?.variant]);

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeBadge?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeBadge?.tokens?.rounded]);

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      rootInheritedAttrs,
      cn({
        "inline-flex items-center justify-center font-medium whitespace-nowrap": true,
        "w-full": !isMini && merged.full,
        "w-fit": !isMini && !merged.full,
        [sizeClass ?? ""]: true,
        [roundedClass ?? ""]: true,
        [get(colorClass, "background") ?? ""]: true,
        [get(colorClass, "border") ?? ""]: true,
        [get(colorClass, "text") ?? ""]: true,
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
