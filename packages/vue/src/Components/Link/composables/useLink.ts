// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  colorProps,
  sizeProps,
  type LinkColor,
  type LinkSize,
} from "@bridge-ui/core/Components/Link";

// ** Local Imports
import type {
  LinkClasses,
  LinkOwnProps,
  LinkProps,
} from "@/Components/Link/link.types";
import {
  mergeBridgeUIStringMap,
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const linkBridgeKeys = [
  "href",
  "color",
  "size",
  "classes",
  "disabled",
  "external",
  "underline",
  "leftIcon",
  "rightIcon",
  "partsProps",
] as const satisfies readonly (keyof LinkOwnProps)[];

const underlineClasses = {
  always: "underline",
  hover: "hover:underline",
  none: "no-underline",
} as const;

export function useLink(props: LinkProps, libDefaults: Partial<LinkOwnProps>) {
  // Setup
  const slots = useSlots();
  const attrs = useAttrs();

  const { userClass, propsForMerge, rootBind } = splitComponentProps(
    props,
    attrs,
    { bridgeKeys: linkBridgeKeys },
  );

  const { entry: bridgeLink, merged } = useBridgeUIComponent({
    libDefaults,
    props: propsForMerge,
    componentName: "Link",
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LinkClasses>({
    entry: bridgeLink,
    props: propsForMerge,
  });

  // Registry maps
  const mergedColorMap = computed(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeLink.value?.customProps?.color,
    );
  });

  const mergedSizeMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeLink.value?.customProps?.size,
    });
  });

  // Theme
  const colorKey = computed(() => {
    return (merged.value.color ?? "primary") as keyof LinkColor;
  });

  const colorItem = computed(() => {
    return get(mergedColorMap.value, colorKey.value);
  });

  const iconSize = computed(() => {
    return (merged.value.size ?? "md") as keyof LinkSize;
  });

  const isDisabled = computed(() => {
    return Boolean(merged.value.disabled);
  });

  // Root
  const rootClass = computed(() => {
    return cn(
      "inline-flex items-center gap-x-1 font-medium transition-colors duration-200",
      "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
      colorItem.value?.base,
      colorItem.value?.hover,
      underlineClasses[merged.value.underline ?? "hover"],
      get(mergedSizeMap.value, merged.value.size ?? "md"),
      mergedClasses.value.root,
      userClass,
    );
  });

  // Visibility
  const showLeftIcon = computed(() => {
    return Boolean(merged.value.leftIcon);
  });

  const showRightIcon = computed(() => {
    return Boolean(merged.value.rightIcon);
  });

  const showPrepend = computed(() => {
    return Boolean(slots.prepend);
  });

  const showAppend = computed(() => {
    return Boolean(slots.append);
  });

  const showDefaultSlot = computed(() => {
    return Boolean(slots.default);
  });

  // Parts
  const partsProps = computed(() => merged.value.partsProps);

  const leftIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.leftIcon,
      cn("shrink-0", mergedClasses.value.leftIcon),
    );
  });

  const rightIconBind = computed(() => {
    return mergePartBind(
      partsProps.value?.rightIcon,
      cn("shrink-0", mergedClasses.value.rightIcon),
    );
  });

  return {
    slots,
    merged,
    rootBind,
    iconSize,
    rootClass,
    isDisabled,
    showAppend,
    showPrepend,
    showLeftIcon,
    showRightIcon,
    showDefaultSlot,
    leftIconBind,
    rightIconBind,
  };
}
