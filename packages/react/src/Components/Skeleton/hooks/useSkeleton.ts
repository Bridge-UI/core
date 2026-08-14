// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { roundedProps } from "@bridge-ui/core/Tokens/Skeleton";
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
  derived,
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
  props: SkeletonProps,
  libDefaults: SkeletonLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    SkeletonProps,
    typeof skeletonBridgeKeys
  >({
    props,
    bridgeKeys: skeletonBridgeKeys,
  });

  const { merged, entry: bridgeSkeleton } = useBridgeUIComponent<
    SkeletonMerged,
    "Skeleton"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Skeleton",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<SkeletonClasses>({
    entry: bridgeSkeleton,
    props: componentProps,
  });

  const roundedClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeSkeleton?.tokens?.rounded,
    );

    return get(classes, merged.rounded);
  }, [merged.rounded, bridgeSkeleton?.tokens?.rounded]);

  const rootBind = derived(() => {
    return mergePartBind(
      {},
      inheritedAttrs,
      cn({
        "block animate-pulse bg-dark-200 dark:bg-dark-700": true,
        [roundedClass ?? ""]: true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
  };
}
