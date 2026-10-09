// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
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
  TextClasses,
  TextOwnProps,
  TextProps,
} from "@/Components/Text/text.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const textBridgeKeys = [
  "as",
  "size",
  "color",
  "weight",
  "classes",
  "numeric",
  "variant",
  "truncate",
  "uppercase",
] as const satisfies readonly (keyof TextOwnProps)[];

type TextLibDefaults = LibDefaultsShape<
  TextOwnProps,
  "as" | "size" | "color" | "weight" | "variant"
>;

type TextMerged = MergeLibDefaults<TextOwnProps, TextLibDefaults>;

export function useText(props: TextOwnProps, libDefaults: TextLibDefaults) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<TextProps, typeof textBridgeKeys>({
      bridgeKeys: textBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeText } = useBridgeUIComponent<
    TextMerged,
    "Text"
  >({
    libDefaults,
    componentName: "Text",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<TextClasses>({
    entry: bridgeText,
    props: () => split.value.componentProps,
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeText.value?.tokens?.size,
    );

    return get(classes, merged.value.size);
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      variantProps,
      bridgeText.value?.tokens?.variant,
    );

    return get(classes, [merged.value.variant, merged.value.color]);
  });

  const weightClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      weightProps,
      bridgeText.value?.tokens?.weight,
    );

    return get(classes, merged.value.weight);
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        [sizeClass.value ?? ""]: true,
        [weightClass.value ?? ""]: true,
        [colorClass.value ?? ""]: true,
        truncate: merged.value.truncate === true,
        "tabular-nums tracking-tight": merged.value.numeric === true,
        "uppercase tracking-wider": merged.value.uppercase === true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
  };
}
