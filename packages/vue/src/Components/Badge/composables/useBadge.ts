// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

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
  "full",
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
  const mergedRoundedMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: roundedProps,
      provider: bridgeBadge.value?.customProps?.rounded,
    });
  });

  const mergedDensityProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      densityProps,
      bridgeBadge.value?.customProps?.density,
    );
  });

  const mergedVariantProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge.value?.customProps?.variant,
    ) as typeof variantProps;
  });

  // Theme
  const sizeKey = computed(() => {
    return merged.value.size ?? "sm";
  });

  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof BadgeColor;
  });

  const variantKey = computed(() => {
    return (merged.value.variant ?? "flat") as keyof typeof variantProps;
  });

  const densityKey = computed(() => {
    return (merged.value.density ?? "default") as keyof typeof densityProps;
  });

  const isMini = computed(() => densityKey.value === "mini");

  const sizeClass = computed(() => {
    return get(mergedDensityProps.value, [densityKey.value, sizeKey.value]);
  });

  const paletteClass = computed(() => {
    return get(mergedVariantProps.value, [variantKey.value, colorKey.value]);
  });

  // Root
  const rootClass = computed(() => {
    return cn(
      "inline-flex items-center justify-center font-medium whitespace-nowrap",
      { "w-full": !isMini.value && merged.value.full },
      { "w-fit": !isMini.value && !merged.value.full },
      paletteClass.value.text,
      paletteClass.value.background,
      paletteClass.value.border,
      sizeClass.value,
      get(mergedRoundedMap.value, merged.value.rounded ?? "md"),
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
