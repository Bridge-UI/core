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
import { invalidatedProps, sizeProps } from "@bridge-ui/core/Components/Label";

// ** Local Imports
import type {
  LabelClasses,
  LabelOwnProps,
  LabelProps,
} from "@/Components/Label/label.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const labelBridgeKeys = [
  "size",
  "error",
  "classes",
  "required",
] as const satisfies readonly (keyof LabelOwnProps)[];

type LabelLibDefaults = LibDefaultsShape<LabelOwnProps, "size">;

type LabelMerged = MergeLibDefaults<LabelOwnProps, LabelLibDefaults>;

export function useLabel(props: LabelOwnProps, libDefaults: LabelLibDefaults) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<LabelProps, typeof labelBridgeKeys>({
      bridgeKeys: labelBridgeKeys,
      props: { ...attrs, ...props },
    });
  });

  const { merged, entry: bridgeLabel } = useBridgeUIComponent<
    LabelMerged,
    "Label"
  >({
    libDefaults,
    componentName: "Label",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LabelClasses>({
    entry: bridgeLabel,
    props: () => split.value.componentProps,
  });

  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLabel.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  const invalidatedColors = computed(() => {
    return mergeBridgeUILayeredClasses(
      invalidatedProps,
      bridgeLabel.value?.customProps?.invalidated,
    );
  });

  const requiredBind = computed(() => {
    return mergePartBind(
      {},
      {},
      cn({
        [invalidatedColors.value.required ?? ""]: true,
        [mergedClasses.value.required ?? ""]: true,
      }),
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(
      {},
      split.value.inheritedAttrs,
      cn({
        "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
        "text-gray-700 dark:text-gray-300": !merged.value.error,
        [invalidatedColors.value.label ?? ""]: merged.value.error,
        [sizeClass.value ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    );
  });

  return {
    merged,
    rootBind,
    requiredBind,
  };
}
