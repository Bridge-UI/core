// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  densityProps,
  roundedProps,
  variantProps,
  type BadgeColor,
} from "@bridge-ui/core/Components/Badge";

// ** Local Imports
import type {
  BadgeClasses,
  BadgeOwnProps,
  BadgeProps,
} from "@/Components/Badge/badge.types";
import {
  mergeBridgeUIStringMap,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const badgeBridgeKeys = [
  "size",
  "color",
  "classes",
  "density",
  "rounded",
  "variant",
] as const satisfies readonly (keyof BadgeOwnProps)[];

export function useBadge(
  props: BadgeProps,
  libDefaults: Partial<BadgeOwnProps>,
) {
  // Setup
  const { className, children, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      bridgeKeys: badgeBridgeKeys,
      peel: ["className", "children"],
    });

  const { entry: bridgeBadge, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Badge",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<BadgeClasses>({
    entry: bridgeBadge,
    props: propsForMerge,
  });

  // Registry maps
  const mergedRoundedMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
      provider: bridgeBadge?.customProps?.rounded,
    });
  }, [bridgeBadge?.customProps?.rounded]);

  const mergedDensityProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      densityProps,
      bridgeBadge?.customProps?.density,
    );
  }, [bridgeBadge?.customProps?.density]);

  const mergedVariantProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge?.customProps?.variant,
    ) as typeof variantProps;
  }, [bridgeBadge?.customProps?.variant]);

  // Theme
  const sizeKey = merged.size ?? "sm";

  const colorKey = (merged.color ?? "primary") as keyof BadgeColor;

  const variantKey = (merged.variant ?? "flat") as keyof typeof variantProps;

  const densityKey = (merged.density ?? "default") as keyof typeof densityProps;

  const sizeClass = get(mergedDensityProps, [densityKey, sizeKey]);

  const paletteClass = get(mergedVariantProps, [variantKey, colorKey]);

  // Root
  const rootClass = cn(
    "inline-flex items-center justify-center font-medium whitespace-nowrap",
    paletteClass.text,
    paletteClass.background,
    paletteClass.border,
    sizeClass,
    get(mergedRoundedMap, merged.rounded ?? "md"),
    mergedClasses.root,
    className,
  );

  return {
    merged,
    children,
    rootClass,
    rootHtmlProps,
  };
}
