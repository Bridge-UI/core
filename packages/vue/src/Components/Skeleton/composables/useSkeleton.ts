// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import { skeletonRoundedProps as roundedProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

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
      bridgeSkeleton.value?.tokens?.rounded,
    );

    return get(classes, merged.value.rounded);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        "block animate-pulse bg-dark-200 dark:bg-dark-700": true,
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
