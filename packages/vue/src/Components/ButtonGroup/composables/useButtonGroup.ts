// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, inject, provide, useAttrs } from "vue";

// ** Core Imports
import { buttonGroupOrientationProps as orientationProps } from "@bridge-ui/core/Tokens";
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
  BUTTON_GROUP_INJECTION_KEY,
  type ButtonGroupContextValue,
} from "@/Components/ButtonGroup/buttonGroupInjectionKey";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonGroupBridgeKeys = [
  "full",
  "size",
  "color",
  "classes",
  "density",
  "rounded",
  "variant",
  "separator",
  "customProps",
  "orientation",
] as const satisfies readonly (keyof ButtonGroupOwnProps)[];

type ButtonGroupLibDefaults = LibDefaultsShape<
  ButtonGroupOwnProps,
  "full" | "color" | "variant" | "separator" | "orientation"
>;

type ButtonGroupMerged = MergeLibDefaults<
  ButtonGroupOwnProps,
  ButtonGroupLibDefaults
>;

/**
 * Builds bind props for a grouped set of action buttons.
 */
export function useButtonGroup(
  props: ButtonGroupOwnProps,
  libDefaults: ButtonGroupLibDefaults,
) {
  const attrs = useAttrs();
  const parentGroup = inject(BUTTON_GROUP_INJECTION_KEY, null);

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

  const orientationItem = computed(() => {
    const classes = mergeBridgeUILayeredClasses(
      orientationProps,
      bridgeButtonGroup.value?.tokens?.orientation,
    );

    return get(classes, merged.value.orientation);
  });

  const contextValue = computed((): ButtonGroupContextValue => {
    const componentProps = split.value.componentProps;
    const registryDefaults = bridgeButtonGroup.value?.defaultProps;
    const parent = parentGroup?.value;

    return {
      size: componentProps.size ?? registryDefaults?.size ?? parent?.size,
      color: componentProps.color ?? registryDefaults?.color ?? parent?.color,
      density:
        componentProps.density ?? registryDefaults?.density ?? parent?.density,
      rounded:
        componentProps.rounded ?? registryDefaults?.rounded ?? parent?.rounded,
      variant:
        componentProps.variant ?? registryDefaults?.variant ?? parent?.variant,
    };
  });

  provide(BUTTON_GROUP_INJECTION_KEY, contextValue);

  const rootBind = computed(() => {
    const separatorOn = merged.value.separator === true;

    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      role: "group",
      "data-slot": "button-group",
      class: cn({
        [get(orientationItem.value, "root") ?? ""]: true,
        [get(orientationItem.value, "join") ?? ""]: !separatorOn,
        [get(orientationItem.value, "separator") ?? ""]: separatorOn,
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
