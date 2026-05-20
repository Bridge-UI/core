// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-vue-next";
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  densityProps,
  roundedProps,
  variantProps,
  type ButtonColor,
  type ButtonColorItem,
} from "@bridge-ui/core/Components/Button";
import type { IconSize } from "@bridge-ui/core/Components/Icon";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonOwnProps,
  ButtonProps,
} from "@/Components/Button/button.types";
import {
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const buttonBridgeKeys = [
  "as",
  "full",
  "href",
  "icon",
  "size",
  "text",
  "color",
  "classes",
  "density",
  "endIcon",
  "loading",
  "rounded",
  "variant",
  "disabled",
  "startIcon",
  "partsProps",
] as const satisfies readonly (keyof ButtonOwnProps)[];

export function useButton(
  props: ButtonProps,
  libDefaults: Partial<ButtonOwnProps>,
) {
  // Setup
  const slots = useSlots();
  const attrs = useAttrs();

  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: buttonBridgeKeys },
  );

  const { entry: bridgeButton, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Button",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    entry: bridgeButton,
    props: propsForMerge,
  });

  // Registry maps
  const mergedVariantProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton.value?.customProps?.variant,
    );
  });

  const mergedDensityProps = computed(() => {
    return mergeBridgeUILayeredClasses(
      densityProps,
      bridgeButton.value?.customProps?.density,
    );
  });

  const roundedClassMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton.value?.customProps?.rounded,
    );
  });

  // Theme
  const densityKey = computed(() => {
    return (merged.value.density ?? "default") as keyof typeof densityProps;
  });

  const sizeKey = computed(() => {
    return merged.value.size ?? "md";
  });

  const isMini = computed(() => {
    return densityKey.value === "mini";
  });

  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof ButtonColor;
  });

  const variantKey = computed(() => {
    return (propsForMerge.variant ??
      (isMini.value
        ? "flat"
        : (merged.value.variant ?? "solid"))) as keyof typeof variantProps;
  });

  const colorItem = computed((): ButtonColorItem | undefined => {
    return get(mergedVariantProps.value, [variantKey.value, colorKey.value]) as
      | ButtonColorItem
      | undefined;
  });

  const colorClasses = computed(() => {
    return cn(
      colorItem.value?.base,
      colorItem.value?.hover,
      colorItem.value?.focus,
    );
  });

  const sizeClass = computed(() => {
    return get(mergedDensityProps.value, [densityKey.value, sizeKey.value]);
  });

  const iconSize = computed(() => {
    return sizeKey.value as keyof IconSize;
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

  const hasDefaultSlot = computed(() => {
    return !!slots.default;
  });

  const isDisabled = computed(() => {
    return merged.value.disabled || merged.value.loading;
  });

  // Root
  const rootClass = computed(() => {
    return cn(
      "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
      "cursor-pointer outline-none outline-hidden inline-flex items-center justify-center",
      "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
      "transition-all ease-in-out duration-200 focus:ring-2",
      "disabled:opacity-80 disabled:cursor-not-allowed",
      { "w-full": !isMini.value && merged.value.full },
      { "w-fit": !isMini.value && !merged.value.full },
      { "group hover:shadow-xs": !isMini.value },
      { "shrink-0": isMini.value },
      colorClasses.value,
      get(roundedClassMap.value, merged.value.rounded ?? "md"),
      sizeClass.value,
      mergedClasses.value.root,
      userClass,
    );
  });

  // Visibility
  const showSpinner = computed(() => {
    return merged.value.loading;
  });

  const canShowContent = computed(() => {
    return !merged.value.loading;
  });

  const showText = computed(() => {
    return canShowContent.value && !!merged.value.text;
  });

  const showEndIcon = computed(() => {
    return canShowContent.value && !!merged.value.endIcon;
  });

  const showStartIcon = computed(() => {
    return canShowContent.value && !!merged.value.startIcon;
  });

  const showIcon = computed(() => {
    return canShowContent.value && Boolean(merged.value.icon);
  });

  const showEndSlot = computed(() => {
    return canShowContent.value && !!slots.end && !merged.value.endIcon;
  });

  const showStartSlot = computed(() => {
    return canShowContent.value && !!slots.start && !merged.value.startIcon;
  });

  const showDefault = computed(() => {
    return canShowContent.value && !merged.value.icon && hasDefaultSlot.value;
  });

  const showDefaultSlot = computed(() => {
    return canShowContent.value && !merged.value.text && hasDefaultSlot.value;
  });

  // Parts
  const partsProps = computed(() => merged.value.partsProps);

  const iconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.icon,
      cn("shrink-0", mergedClasses.value.icon),
    );
  });

  const endIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.endIcon,
      cn("shrink-0", mergedClasses.value.endIcon),
    );
  });

  const startIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.startIcon,
      cn("shrink-0", mergedClasses.value.startIcon),
    );
  });

  const endSlotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.end,
      "inline-flex shrink-0 items-center",
    );
  });

  const startSlotBind = computed(() => {
    return mergePartBind(
      partsProps.value?.start,
      "inline-flex shrink-0 items-center",
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
    slots,
    isMini,
    merged,
    iconBind,
    iconSize,
    isAnchor,
    isButton,
    rootBind,
    showText,
    showIcon,
    rootClass,
    isDisabled,
    endIconBind,
    endSlotBind,
    showEndIcon,
    showEndSlot,
    showSpinner,
    showStartIcon,
    showStartSlot,
    startIconBind,
    startSlotBind,
    loadingIconBind,
    showDefaultSlot,
    showDefault,
    spinnerIcon: Loader2,
  };
}
