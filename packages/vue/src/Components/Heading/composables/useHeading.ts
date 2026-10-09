// ** External Imports
import { get, isNil } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  headingLevelProps as levelProps,
  textSizeProps as sizeProps,
  textVariantProps as variantProps,
  textWeightProps as weightProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  HeadingClasses,
  HeadingOwnProps,
  HeadingProps,
} from "@/Components/Heading/heading.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const headingBridgeKeys = [
  "size",
  "color",
  "level",
  "weight",
  "classes",
  "variant",
] as const satisfies readonly (keyof HeadingOwnProps)[];

type HeadingLibDefaults = LibDefaultsShape<
  HeadingOwnProps,
  "color" | "level" | "weight" | "variant"
>;

type HeadingMerged = MergeLibDefaults<HeadingOwnProps, HeadingLibDefaults>;

export function useHeading(
  props: HeadingOwnProps,
  libDefaults: HeadingLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<HeadingProps, typeof headingBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: headingBridgeKeys,
    });
  });

  const { merged, entry: bridgeHeading } = useBridgeUIComponent<
    HeadingMerged,
    "Heading"
  >({
    libDefaults,
    componentName: "Heading",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<HeadingClasses>({
    entry: bridgeHeading,
    props: () => split.value.componentProps,
  });

  const rootTag = computed(() => {
    return `h${merged.value.level}` as const;
  });

  const sizeClass = computed(() => {
    if (isNil(merged.value.size)) {
      const classes = mergeBridgeUILayeredClasses(
        levelProps,
        bridgeHeading.value?.tokens?.level,
      );

      return get(classes, String(merged.value.level));
    }

    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeHeading.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeHeading.value?.tokens?.variant,
    );

    return get(classes, [merged.value.variant, merged.value.color]);
  });

  const weightClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      weightProps,
      bridgeHeading.value?.tokens?.weight,
    );

    return get(classes, merged.value.weight);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        "tracking-tight": true,
        [sizeClass.value ?? ""]: true,
        [weightClass.value ?? ""]: true,
        [colorClass.value ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootTag,
    rootBind,
  };
}
