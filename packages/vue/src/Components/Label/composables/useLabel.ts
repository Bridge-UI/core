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
import { sizeProps } from "@bridge-ui/core/Components/Label";

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
  // Setup
  const attrs = useAttrs();

  const { customProps, inheritedAttrs } = splitComponentProps<
    LabelProps,
    typeof labelBridgeKeys
  >({
    bridgeKeys: labelBridgeKeys,
    props: { ...attrs, ...props },
  });

  const { entry: bridgeLabel, merged } = useBridgeUIComponent<
    LabelMerged,
    "Label"
  >({
    libDefaults,
    props: customProps,
    componentName: "Label",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LabelClasses>({
    entry: bridgeLabel,
    props: customProps,
  });

  // Classes
  const sizeClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLabel.value?.customProps?.size,
    );

    return get(classes, merged.value.size);
  });

  // Binds
  // prettier-ignore
  const requiredBind = computed(() => {
    return mergePartBind({}, {}, cn({
      // Theme classes
      "text-error-500 dark:text-error-500 select-none": true,
      // Custom classes
      [mergedClasses.value.required ?? ""]: true,
    }));
  });

  // prettier-ignore
  const rootBind = computed(() => {
    return mergePartBind({}, inheritedAttrs, cn({
      // Theme classes
      "inline-flex items-center gap-x-0.5 font-medium leading-none": true,
      "text-error-600 dark:text-error-400": merged.value.error,
      "text-gray-700 dark:text-gray-300": !merged.value.error,
      [sizeClass.value ?? ""]: true,
      // Custom classes
      [mergedClasses.value.root ?? ""]: true,
    }));
  });

  return {
    merged,
    rootBind,
    requiredBind,
  };
}
