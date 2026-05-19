// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

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
  "size",
  "color",
  "classes",
  "rounded",
  "variant",
] as const satisfies readonly (keyof BadgeOwnProps)[];

export function useBadge(
  props: BadgeProps,
  libDefaults: Partial<BadgeOwnProps>,
) {
  // Setup
  const attrs = useAttrs();

  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: badgeBridgeKeys },
  );

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
  const mergedSizeMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeBadge.value?.customProps?.size,
    });
  });

  const mergedRoundedMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
      provider: bridgeBadge.value?.customProps?.rounded,
    });
  });

  const mergedVariantProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge.value?.customProps?.variant,
    ) as typeof variantProps;
  });

  // Theme
  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof BadgeColor;
  });

  const variantKey = computed(() => {
    return (merged.value.variant ?? "flat") as keyof typeof variantProps;
  });

  const palette = computed(() => {
    return get(mergedVariantProps.value, [variantKey.value, colorKey.value]);
  });

  // Root
  const rootClass = computed(() => {
    return cn(
      "inline-flex items-center justify-center font-medium whitespace-nowrap",
      palette.value.text,
      palette.value.background,
      palette.value.border,
      get(mergedSizeMap.value, merged.value.size ?? "sm"),
      get(mergedRoundedMap.value, merged.value.rounded ?? "full"),
      mergedClasses.value.root,
      userClass,
    );
  });

  return {
    merged,
    rootBind,
    rootClass,
  };
}
