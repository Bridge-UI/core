// ** External Imports
import { get } from "es-toolkit/compat";
import { Loader2 } from "lucide-vue-next";
import { computed, useSlots } from "vue";

// ** Core Imports
import type { ButtonColorItem, Direction } from "@bridge-ui/core";
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import { roundedProps } from "@bridge-ui/core/Components/Button/Rounded";
import { sizeProps as buttonSizeProps } from "@bridge-ui/core/Components/Button/Size";
import { variantProps } from "@bridge-ui/core/Components/Button/Variant";

// ** Local Imports
import type {
  ButtonClasses,
  ButtonProps,
} from "@/Components/Button/button.types";
import { useBridgeUI } from "@/Provider/useBridgeUI";
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

  const mergedRegistryClasses = useBridgeUIMergedRegistryClasses<ButtonClasses>(
    {
      entry: bridgeButton,
      props,
    },
  );

  const bridge = useBridgeUI();

  const direction = computed((): Direction => {
    return bridge?.global.value.direction ?? "ltr";
  });

  const mergedVariantMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      variantProps,
      bridgeButton.value?.customProps?.variant,
    );
  });

  const sizeClassMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      buttonSizeProps,
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
      merged.value.variant,
      merged.value.color,
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
      "transition-all ease-in-out duration-200 focus:ring-2",
      "disabled:opacity-80 disabled:cursor-not-allowed",
      get(roundedClassMap.value, [merged.value.rounded]),
      get(sizeClassMap.value, [merged.value.size]),
      mergedRegistryClasses.value.root,
      merged.value.full && "w-full",
      colorClasses.value,
    );
  });

  const showSpinner = computed(() => {
    return merged.value.loading;
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

  const endIconClass = computed(() => {
    return cn("shrink-0", mergedRegistryClasses.value.endIcon);
  });

  const startIconClass = computed(() => {
    return cn("shrink-0", mergedRegistryClasses.value.startIcon);
  });

  const spinnerIconClass = computed(() => {
    return cn("shrink-0 animate-spin", mergedRegistryClasses.value.loading);
  });

  return {
    tag,
    slots,
    merged,
    isAnchor,
    isButton,
    direction,
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
    spinnerIconClass,
    spinnerIcon: Loader2,
  };
}
