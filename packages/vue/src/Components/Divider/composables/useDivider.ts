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
  colorProps,
  orientationProps,
} from "@bridge-ui/core/Components/Divider";

// ** Local Imports
import type {
  DividerClasses,
  DividerOwnProps,
  DividerProps,
} from "@/Components/Divider/divider.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const dividerBridgeKeys = [
  "color",
  "classes",
  "orientation",
] as const satisfies readonly (keyof DividerOwnProps)[];

type DividerLibDefaults = LibDefaultsShape<
  DividerOwnProps,
  "color" | "orientation"
>;

type DividerMerged = MergeLibDefaults<DividerOwnProps, DividerLibDefaults>;

export function useDivider(
  props: DividerOwnProps,
  libDefaults: DividerLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<DividerProps, typeof dividerBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: dividerBridgeKeys,
    });
  });

  const { merged, entry: bridgeDivider } = useBridgeUIComponent<
    DividerMerged,
    "Divider"
  >({
    libDefaults,
    componentName: "Divider",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<DividerClasses>({
    entry: bridgeDivider,
    props: () => split.value.componentProps,
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeDivider.value?.customProps?.color,
    );

    return get(classes, merged.value.color);
  });

  const orientationClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeDivider.value?.customProps?.orientation,
    );

    return get(classes, merged.value.orientation);
  });

  const rootBind = computed(() => {
    return mergePartBind({}, split.value.inheritedAttrs, {
      role: "separator",
      "aria-orientation": merged.value.orientation,
      class: cn({
        "m-0 shrink-0 border-0": true,
        [colorClass.value ?? ""]: true,
        [orientationClass.value ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
