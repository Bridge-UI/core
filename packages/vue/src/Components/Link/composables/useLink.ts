// ** External Imports
import { get } from "es-toolkit/compat";
import { computed, useAttrs, useSlots } from "vue";

// ** Core Imports
import { cn, mergeBridgeUILayeredClasses } from "@bridge-ui/core";
import {
  colorProps,
  sizeProps,
  underlineProps,
  type LinkColor,
  type LinkSize,
  type LinkUnderline,
} from "@bridge-ui/core/Components/Link";

// ** Local Imports
import type {
  LinkClasses,
  LinkOwnProps,
  LinkProps,
} from "@/Components/Link/link.types";
import {
  hasNamedSlot,
  mergeBridgeUIStringMap,
  mergePartBind,
  splitComponentProps,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const linkBridgeKeys = [
  "href",
  "size",
  "color",
  "classes",
  "disabled",
  "external",
  "leftIcon",
  "rightIcon",
  "underline",
  "partsProps",
] as const satisfies readonly (keyof LinkOwnProps)[];

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

  const mergedUnderlineMap = computed(() => {
    return mergeBridgeUIStringMap({
      lib: underlineProps,
      provider: bridgeLink.value?.customProps?.underline,
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
      get(
        mergedUnderlineMap.value,
        (merged.value.underline ?? "hover") as keyof LinkUnderline,
      ),
      get(mergedSizeMap.value, merged.value.size ?? "md"),
      mergedClasses.value.root,
      userClass,
    );
  });

  // Visibility

  const showAppend = computed(() => {
    return hasNamedSlot(slots, "append");
  });

  const showPrepend = computed(() => {
    return hasNamedSlot(slots, "prepend");
  });

  const showDefaultSlot = computed(() => {
    return hasNamedSlot(slots, "default");
  });

  const showLeftIcon = computed(() => {
    return Boolean(merged.value.leftIcon);
  });

  const showRightIcon = computed(() => {
    return Boolean(merged.value.rightIcon);
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
    iconSize,
    rootBind,
    rootClass,
    isDisabled,
    showAppend,
    showPrepend,
    leftIconBind,
    showLeftIcon,
    rightIconBind,
    showRightIcon,
    showDefaultSlot,
  };
}
