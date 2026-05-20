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
  const colorKey = (merged.color ?? "primary") as keyof LinkColor;

  const colorItem = get(mergedColorMap, colorKey);

  const iconSize = (merged.size ?? "md") as keyof LinkSize;

  const isDisabled = Boolean(merged.disabled);

  // Root
  const rootClass = cn(
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

  // Visibility
  const showLeftIcon = Boolean(merged.leftIcon);

  const showRightIcon = Boolean(merged.rightIcon);

  const showAppend = hasNamedSlot(slots, "append");

  const showPrepend = hasNamedSlot(slots, "prepend");

  const hasChildren = children != null && children !== false;

  // Parts
  const partsProps = merged.partsProps;

  const leftIconBind = mergePartBind(
    partsProps?.leftIcon,
    cn("shrink-0", mergedClasses.leftIcon),
  );

  const rightIconBind = mergePartBind(
    partsProps?.rightIcon,
    cn("shrink-0", mergedClasses.rightIcon),
  );

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
