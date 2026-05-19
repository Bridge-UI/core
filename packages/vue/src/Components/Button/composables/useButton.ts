// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-vue-next";
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  roundedProps,
  sizeProps,
  variantProps,
  type ButtonColorItem,
} from "@bridge-ui/core/Components/Button";

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
  "size",
  "text",
  "color",
  "classes",
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
  const mergedVariantMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton.value?.customProps?.variant,
    );
  });

  const sizeClassMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeButton.value?.customProps?.size,
    );
  });

  const roundedClassMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      roundedProps,
      bridgeButton.value?.customProps?.rounded,
    );
  });

  // Theme
  const colorItem = computed((): ButtonColorItem | undefined => {
    return get(mergedVariantMap.value, [
      merged.value.variant ?? "solid",
      merged.value.color ?? "primary",
    ]) as ButtonColorItem | undefined;
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
      "cursor-pointer outline-none outline-hidden inline-flex justify-center items-center group hover:shadow-xs",
      "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
      "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
      "transition-all ease-in-out duration-200 focus:ring-2",
      "disabled:opacity-80 disabled:cursor-not-allowed",
      colorClasses.value,
      get(roundedClassMap.value, merged.value.rounded ?? "sm"),
      get(sizeClassMap.value, merged.value.size ?? "md"),
      merged.value.full && "w-full",
      mergedClasses.value.root,
      userClass,
    );
  });

  // Visibility
  const showSpinner = computed(() => {
    return merged.value.loading;
  });

  const hasDefaultSlot = computed(() => {
    return !!slots.default;
  });

  const showText = computed(() => {
    return !merged.value.loading && !!merged.value.text;
  });

  const showEndIcon = computed(() => {
    return !merged.value.loading && !!merged.value.endIcon;
  });

  const showStartIcon = computed(() => {
    return !merged.value.loading && !!merged.value.startIcon;
  });

  const showEndSlot = computed(() => {
    return !merged.value.loading && !merged.value.endIcon && !!slots.end;
  });

  const showStartSlot = computed(() => {
    return !merged.value.loading && !merged.value.startIcon && !!slots.start;
  });

  const showDefaultSlot = computed(() => {
    return !merged.value.loading && hasDefaultSlot.value && !merged.value.text;
  });

  // Parts
  const partsProps = computed(() => merged.value.partsProps);

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
    merged,
    isAnchor,
    isButton,
    rootBind,
    showText,
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
    spinnerIcon: Loader2,
  };
}
