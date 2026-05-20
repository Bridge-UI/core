// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-vue-next";
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn } from "@bridge-ui/core";
import {
  roundedProps,
  variantProps,
  type ButtonColorItem,
} from "@bridge-ui/core/Components/Button";
import type { IconSize } from "@bridge-ui/core/Components/Icon";
import { sizeProps } from "@bridge-ui/core/Components/MiniButton";

// ** Local Imports
import type {
  MiniButtonClasses,
  MiniButtonOwnProps,
  MiniButtonProps,
} from "@/Components/MiniButton/miniButton.types";
import {
  mergeBridgeUIStringMap,
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const miniButtonBridgeKeys = [
  "as",
  "icon",
  "href",
  "size",
  "color",
  "classes",
  "loading",
  "rounded",
  "variant",
  "disabled",
  "partsProps",
] as const satisfies readonly (keyof MiniButtonOwnProps)[];

export function useMiniButton(
  props: MiniButtonProps,
  libDefaults: Partial<MiniButtonOwnProps>,
) {
  // Setup
  const slots = useSlots();

  const attrs = useAttrs();

  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: miniButtonBridgeKeys },
  );

  const { entry: bridgeMiniButton, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "MiniButton",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<MiniButtonClasses>({
    entry: bridgeMiniButton,
    props: propsForMerge,
  });

  // Registry maps
  const mergedRoundedMap = computed(() => {
    return roundedProps;
  });

  const mergedVariantMap = computed(() => {
    return variantProps;
  });

  const mergedSizeMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeMiniButton.value?.customProps?.size,
    });
  });

  // Theme
  const colorItem = computed((): ButtonColorItem | undefined => {
    return get(mergedVariantMap.value, [
      merged.value.variant ?? "flat",
      merged.value.color ?? "primary",
    ]) as ButtonColorItem | undefined;
  });

  const iconSize = computed(() => {
    return (merged.value.size ?? "md") as keyof IconSize;
  });

  const colorClasses = computed(() => {
    return cn(
      colorItem.value?.base,
      colorItem.value?.hover,
      colorItem.value?.focus,
    );
  });

  // Element
  const tag = computed(() => {
    return merged.value.as ?? "button";
  });

  const isAnchor = computed(() => {
    return tag.value === "a";
  });

  const isButton = computed(() => {
    return tag.value === "button";
  });

  const isDisabled = computed(() => {
    return merged.value.disabled || merged.value.loading;
  });

  // Root
  const rootClass = computed(() => {
    return cn(
      "inline-flex shrink-0 items-center justify-center cursor-pointer outline-none outline-hidden",
      "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
      "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
      "transition-all ease-in-out duration-200 focus:ring-2",
      "disabled:opacity-80 disabled:cursor-not-allowed",
      colorClasses.value,
      get(mergedRoundedMap.value, merged.value.rounded ?? "md"),
      get(mergedSizeMap.value, merged.value.size ?? "md"),
      mergedClasses.value.root,
      userClass,
    );
  });

  // Visibility
  const showSpinner = computed(() => {
    return merged.value.loading;
  });

  const hasDefaultSlot = computed(() => {
    return Boolean(slots.default);
  });

  const showIcon = computed(() => {
    return !merged.value.loading && Boolean(merged.value.icon);
  });

  const showDefaultSlot = computed(() => {
    return !merged.value.loading && hasDefaultSlot.value && !merged.value.icon;
  });

  // Parts
  const partsProps = computed(() => merged.value.partsProps);

  const iconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.icon,
      cn("shrink-0", mergedClasses.value.icon),
    );
  });

  const loadingIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.loading,
      cn("shrink-0 animate-spin", mergedClasses.value.loading),
    );
  });

  return {
    tag,
    merged,
    iconBind,
    iconSize,
    isAnchor,
    isButton,
    rootBind,
    showIcon,
    rootClass,
    isDisabled,
    showSpinner,
    loadingIconBind,
    showDefaultSlot,
    spinnerIcon: Loader2,
  };
}
