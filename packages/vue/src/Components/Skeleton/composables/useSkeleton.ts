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
import { roundedProps } from "@bridge-ui/core/Components/Skeleton";

// ** Local Imports
import type {
  SkeletonClasses,
  SkeletonOwnProps,
  SkeletonProps,
} from "@/Components/Skeleton/skeleton.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const skeletonBridgeKeys = [
  "classes",
  "rounded",
] as const satisfies readonly (keyof SkeletonOwnProps)[];

type SkeletonLibDefaults = LibDefaultsShape<SkeletonOwnProps, "rounded">;

type SkeletonMerged = MergeLibDefaults<SkeletonOwnProps, SkeletonLibDefaults>;

export function useSkeleton(
  props: SkeletonOwnProps,
  libDefaults: SkeletonLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<SkeletonProps, typeof skeletonBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: skeletonBridgeKeys,
    });
  });

  const { merged, entry: bridgeSkeleton } = useBridgeUIComponent<
    SkeletonMerged,
    "Skeleton"
  >({
    libDefaults,
    componentName: "Skeleton",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SkeletonClasses>({
    entry: bridgeSkeleton,
    props: () => split.value.componentProps,
  });

  const roundedClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSkeleton.value?.customProps?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        "block animate-pulse bg-gray-200 dark:bg-gray-700": true,
        [roundedClass.value ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
  };
}
