// ** External Imports
import { get } from "es-toolkit/compat";
import { useMemo } from "react";

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
    underlineClasses[merged.underline ?? "hover"],
    get(mergedSizeMap, merged.size ?? "md"),
    mergedClasses.root,
    className,
  );

  // Visibility
  const showLeftIcon = Boolean(merged.leftIcon);

  const showRightIcon = Boolean(merged.rightIcon);

  const showPrepend = slots?.prepend != null;

  const showAppend = slots?.append != null;

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
    showPrepend,
    hasChildren,
    rootHtmlProps,
    showLeftIcon,
    showRightIcon,
    leftIconBind,
    rightIconBind,
  };
}
