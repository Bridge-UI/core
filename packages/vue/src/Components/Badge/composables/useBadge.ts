// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

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

export function useBadge(props: BadgeOwnProps, libDefaults: BadgeLibDefaults) {
  // Setup
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<BadgeProps, typeof badgeBridgeKeys>({
      bridgeKeys: badgeBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { entry: bridgeBadge, merged } = useBridgeUIComponent<
    BadgeMerged,
    "Badge"
  >({
    libDefaults,
    componentName: "Badge",
    props: () => split.value.customProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<BadgeClasses>({
    entry: bridgeBadge,
    props: () => split.value.customProps,
  });

  // Elements
  const isMini = computed(() => {
    return merged.value.density === "mini";
  });

  // Classes
  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      densityProps,
      bridgeBadge.value?.customProps?.density,
    );

    return get(classes, [merged.value.density, merged.value.size]);
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeBadge.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeBadge.value?.customProps?.variant,
    );

    return get(classes, [merged.value.variant, merged.value.color]);
  });

  // Binds
  // prettier-ignore
  const rootBind = computed(() => {
    return mergePartBind({}, split.value.inheritedAttrs, cn({
      // Theme classes
      "inline-flex items-center justify-center font-medium whitespace-nowrap": true,
      [get(colorClass.value, "background") ?? ""]: true,
      [get(colorClass.value, "border") ?? ""]: true,
      "w-full": !isMini.value && merged.value.full,
      "w-fit": !isMini.value && !merged.value.full,
      [get(colorClass.value, "text") ?? ""]: true,
      [roundedClass.value ?? ""]: true,
      [sizeClass.value ?? ""]: true,
      // Custom classes
      [mergedClasses.value.root ?? ""]: true,
    }));
  });

  return {
    merged,
    rootBind,
  };
}
