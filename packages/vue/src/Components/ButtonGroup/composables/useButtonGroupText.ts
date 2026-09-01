// ** External Imports
import { computed, useAttrs } from "vue";

// ** Core Imports
import { buttonGroupTextProps as textProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  ButtonGroupTextClasses,
  ButtonGroupTextOwnProps,
  ButtonGroupTextProps,
} from "@/Components/ButtonGroup/buttonGroup.types";
import {
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonGroupTextBridgeKeys = [
  "as",
  "classes",
  "customProps",
] as const satisfies readonly (keyof ButtonGroupTextOwnProps)[];

type ButtonGroupTextLibDefaults = LibDefaultsShape<
  ButtonGroupTextOwnProps,
  "as"
>;

type ButtonGroupTextMerged = MergeLibDefaults<
  ButtonGroupTextOwnProps,
  ButtonGroupTextLibDefaults
>;

/**
 * Builds bind props for static text inside a button group.
 */
export function useButtonGroupText(
  props: ButtonGroupTextOwnProps,
  libDefaults: ButtonGroupTextLibDefaults,
) {
  const attrs = useAttrs();

  const split = computed(() => {
    return splitComponentProps<
      ButtonGroupTextProps,
      typeof buttonGroupTextBridgeKeys
    >({
      props: { ...attrs, ...props },
      bridgeKeys: buttonGroupTextBridgeKeys,
    });
  });

  const { merged, entry: bridgeButtonGroupText } = useBridgeUIComponent<
    ButtonGroupTextMerged,
    "ButtonGroupText"
  >({
    libDefaults,
    componentName: "ButtonGroupText",
    props: () => split.value.componentProps,
  });

  const mergedClasses =
    useBridgeUIMergedRegistryClasses<ButtonGroupTextClasses>({
      entry: bridgeButtonGroupText,
      props: () => split.value.componentProps,
    });

  const customProps = computed(() => {
    return merged.value.customProps;
  });

  const tag = computed(() => {
    return merged.value.as ?? "span";
  });

  const textItem = computed(() => {
    return mergeBridgeUILayeredClasses(
      textProps,
      bridgeButtonGroupText.value?.tokens?.text,
    );
  });

  const rootBind = computed(() => {
    return mergePartBind(customProps.value?.root, split.value.inheritedAttrs, {
      class: cn({
        [textItem.value.root ?? ""]: true,
        [mergedClasses.value.root ?? ""]: true,
      }),
    });
  });

  return {
    tag,
    merged,
    rootBind,
  };
}
