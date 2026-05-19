// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

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
  "size",
  "color",
  "classes",
  "rounded",
  "variant",
] as const satisfies readonly (keyof MiniBadgeOwnProps)[];

export function useMiniBadge(
  props: MiniBadgeProps,
  libDefaults: Partial<MiniBadgeOwnProps>,
) {
  // Setup
  const attrs = useAttrs();

  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: miniBadgeBridgeKeys },
  );

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
  const mergedSizeMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeMiniBadge.value?.customProps?.size,
    });
  });

  const mergedRoundedMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
    });
  });

  const mergedVariantProps = computed(() => {
    return variantProps;
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
      get(mergedSizeMap.value, merged.value.size ?? "xs"),
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
