// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import {
  roundedProps,
  variantProps,
  type BadgeColor,
} from "@bridge-ui/core/Components/Badge";
import { sizeProps } from "@bridge-ui/core/Components/MiniBadge";

// ** Local Imports
import type {
  MiniBadgeClasses,
  MiniBadgeOwnProps,
  MiniBadgeProps,
} from "@/Components/MiniBadge/miniBadge.types";
import {
  mergeBridgeUIStringMap,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const miniBadgeBridgeKeys = [
  "color",
  "size",
  "classes",
  "rounded",
  "variant",
] as const satisfies readonly (keyof MiniBadgeOwnProps)[];

export function useMiniBadge(
  props: MiniBadgeProps,
  libDefaults: Partial<MiniBadgeOwnProps>,
) {
  // Setup
  const { className, children, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      bridgeKeys: miniBadgeBridgeKeys,
      peel: ["className", "children"],
    });

  const { entry: bridgeMiniBadge, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "MiniBadge",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<MiniBadgeClasses>({
    entry: bridgeMiniBadge,
    props: propsForMerge,
  });

  // Registry maps
  const mergedSizeMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeMiniBadge?.customProps?.size,
    });
  }, [bridgeMiniBadge?.customProps?.size]);

  const mergedRoundedMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
    });
  }, []);

  const mergedVariantProps = useMemo(() => {
    return variantProps;
  }, []);

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
    get(mergedSizeMap, merged.size ?? "xs"),
    get(mergedRoundedMap, merged.rounded ?? "full"),
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
