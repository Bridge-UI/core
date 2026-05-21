// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

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
  derived,
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
  const { className, children, slots, propsForMerge, rootHtmlProps } =
    splitComponentProps(props, {
      bridgeKeys: linkBridgeKeys,
      peel: ["className", "children", "slots"],
    });

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
  const mergedColorMap = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      colorProps,
      bridgeLink?.customProps?.color,
    );
  }, [bridgeLink?.customProps?.color]);

  const mergedSizeMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: sizeProps,
      provider: bridgeLink?.customProps?.size,
    });
  }, [bridgeLink?.customProps?.size]);

  const mergedUnderlineMap = useMemo(() => {
    return mergeBridgeUIStringMap({
      lib: underlineProps,
      provider: bridgeLink?.customProps?.underline,
    });
  }, [bridgeLink?.customProps?.underline]);

  // Theme
  const isDisabled = derived(() => {
    return Boolean(merged.disabled);
  });

  const iconSize = derived(() => {
    return (merged.size ?? "md") as keyof LinkSize;
  });

  const colorKey = derived(() => {
    return (merged.color ?? "primary") as keyof LinkColor;
  });

  const colorItem = derived(() => {
    return get(mergedColorMap, colorKey);
  });

  // Root
  const rootClass = derived(() => {
    return cn(
      "inline-flex items-center gap-x-1 font-medium transition-colors duration-200",
      "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none",
      colorItem?.base,
      colorItem?.hover,
      get(
        mergedUnderlineMap,
        (merged.underline ?? "hover") as keyof LinkUnderline,
      ),
      get(mergedSizeMap, merged.size ?? "md"),
      mergedClasses.root,
      className,
    );
  });

  // Visibility
  const showLeftIcon = derived(() => {
    return Boolean(merged.leftIcon);
  });

  const showRightIcon = derived(() => {
    return Boolean(merged.rightIcon);
  });

  const showAppend = derived(() => {
    return hasNamedSlot(slots, "append");
  });

  const showPrepend = derived(() => {
    return hasNamedSlot(slots, "prepend");
  });

  const hasChildren = derived(() => {
    return children != null && children !== false;
  });

  // Parts
  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const leftIconBind = derived(() => {
    return mergePartBind(
      partsProps?.leftIcon,
      cn("shrink-0", mergedClasses.leftIcon),
    );
  });

  const rightIconBind = derived(() => {
    return mergePartBind(
      partsProps?.rightIcon,
      cn("shrink-0", mergedClasses.rightIcon),
    );
  });

  return {
    slots,
    merged,
    children,
    iconSize,
    rootClass,
    isDisabled,
    showAppend,
    hasChildren,
    showPrepend,
    leftIconBind,
    showLeftIcon,
    rightIconBind,
    rootHtmlProps,
    showRightIcon,
  };
}
