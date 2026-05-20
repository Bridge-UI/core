// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  roundedProps,
  sizeProps,
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
  "color",
  "size",
  "classes",
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
  const mergedSizeMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeBadge?.customProps?.size,
    });
  }, [bridgeBadge?.customProps?.size]);

  const mergedRoundedMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
      provider: bridgeBadge?.customProps?.rounded,
    });
  }, [bridgeBadge?.customProps?.rounded]);

  const mergedVariantProps = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge?.customProps?.variant,
    ) as typeof variantProps;
  }, [bridgeBadge?.customProps?.variant]);

  // Theme
  const colorKey = (merged.color ?? "primary") as keyof BadgeColor;

  const variantKey = (merged.variant ?? "flat") as keyof typeof variantProps;

  const palette = get(mergedVariantProps, [variantKey, colorKey]);

  // Root
  const rootClass = cn(
    "inline-flex items-center justify-center font-medium whitespace-nowrap",
    palette.text,
    palette.background,
    palette.border,
    get(mergedSizeMap, merged.size ?? "sm"),
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
