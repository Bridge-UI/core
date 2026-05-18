// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-vue-next";
import { computed, useSlots } from "vue";

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
  ButtonProps,
} from "@/Components/Button/button.types";
import {
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

export function useButton(
  props: ButtonProps,
  libDefaults: Partial<ButtonProps>,
) {
  const slots = useSlots();

  const { entry: bridgeButton, merged } = useBridgeUIComponent({
    props,
    libDefaults,
    componentName: "Button",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>({
    entry: bridgeButton,
    props,
  });

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

  const isAnchor = computed(() => {
    return tag.value === "a";
  });

  const isButton = computed(() => {
    return tag.value === "button";
  });

  const tag = computed(() => {
    return merged.value.as ?? "button";
  });

  const isDisabled = computed(() => {
    return merged.value.disabled || merged.value.loading;
  });

  const rootClass = computed(() => {
    return cn(
      "cursor-pointer outline-none outline-hidden inline-flex justify-center items-center group hover:shadow-xs",
      "focus:ring-offset-background-white dark:focus:ring-offset-background-dark",
      get(roundedClassMap.value, merged.value.rounded ?? "sm"),
      "transition-all ease-in-out duration-200 focus:ring-2",
      get(sizeClassMap.value, merged.value.size ?? "md"),
      "disabled:opacity-80 disabled:cursor-not-allowed",
      merged.value.full && "w-full",
      mergedClasses.value.root,
      colorClasses.value,
    );
  });

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

  const endIconClass = computed(() => {
    return cn("shrink-0", mergedClasses.value.endIcon);
  });

  const startIconClass = computed(() => {
    return cn("shrink-0", mergedClasses.value.startIcon);
  });

  const spinnerIconClass = computed(() => {
    return cn("shrink-0 animate-spin", mergedClasses.value.loading);
  });

  return {
    tag,
    slots,
    merged,
    isAnchor,
    isButton,
    showText,
    rootClass,
    isDisabled,
    showEndIcon,
    showEndSlot,
    showSpinner,
    bridgeButton,
    endIconClass,
    showStartIcon,
    showStartSlot,
    startIconClass,
    showDefaultSlot,
    spinnerIconClass,
    spinnerIcon: Loader2,
  };
}
