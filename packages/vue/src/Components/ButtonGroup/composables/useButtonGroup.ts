// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs } from "vue";

// ** Core Imports
import {
  buttonGroupColorProps as colorProps,
  buttonGroupOrientationProps as orientationProps,
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
  ButtonGroupClasses,
  ButtonGroupOwnProps,
  ButtonGroupProps,
} from "@/Components/ButtonGroup/buttonGroup.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonGroupBridgeKeys = [
  "full",
  "color",
  "classes",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ButtonGroupOwnProps)[];

type ButtonGroupLibDefaults = LibDefaultsShape<
  ButtonGroupOwnProps,
  "full" | "color" | "orientation"
>;

type ButtonGroupMerged = MergeLibDefaults<
  ButtonGroupOwnProps,
  ButtonGroupLibDefaults
>;

/**
 * Builds bind props for a grouped set of action controls.
 */
export function useButtonGroup(
  props: ButtonGroupOwnProps,
  libDefaults: ButtonGroupLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<ButtonGroupProps, typeof buttonGroupBridgeKeys>({
      props: { ...attrs, ...props },
      bridgeKeys: buttonGroupBridgeKeys,
    });
  });

  const { merged, entry: bridgeButtonGroup } = useBridgeUIComponent<
    ButtonGroupMerged,
    "ButtonGroup"
  >({
    libDefaults,
    componentName: "ButtonGroup",
    props: () => split.value.componentProps,
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonGroupClasses>({
    entry: bridgeButtonGroup,
    props: () => split.value.componentProps,
  });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const colorClass = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeButtonGroup.value?.tokens?.color,
    );

    return get(classes, merged.value.color);
  });

  const orientationItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeButtonGroup.value?.tokens?.orientation,
    );

    return get(classes, merged.value.orientation);
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      role: "group",
      "data-slot": "button-group",
      class: cn({
        [colorClass.value ?? ""]: true,
        [get(orientationItem.value, "root") ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
        "w-full [&>*]:flex-1": merged.value.full === true,
      }),
    });
  });

  return {
    merged,
    rootBind,
  };
}
