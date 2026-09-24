// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo, type ElementType } from "react";

// ** Core Imports
import {
  linkColorProps as colorProps,
  linkSizeProps as sizeProps,
  linkUnderlineProps as underlineProps,
} from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type {
  LinkClasses,
  LinkOwnProps,
  LinkProps,
} from "@/Components/Link/link.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";
import { resolveLinkAsProps } from "@/Utils/linkAs";

const linkBridgeKeys = [
  "href",
  "size",
  "color",
  "linkAs",
  "classes",
  "disabled",
  "external",
  "leftIcon",
  "linkProps",
  "rightIcon",
  "underline",
  "customProps",
] as const satisfies readonly (keyof LinkOwnProps)[];

type LinkLibDefaults = LibDefaultsShape<
  LinkOwnProps,
  "size" | "color" | "underline"
>;

type LinkMerged<T extends ElementType = "a"> = MergeLibDefaults<
  LinkOwnProps<T>,
  LinkLibDefaults
>;

export function useLink<T extends ElementType = "a">(
  props: LinkProps<T>,
  libDefaults: LinkLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    LinkProps<T>,
    typeof linkBridgeKeys
  >({
    props,
    bridgeKeys: linkBridgeKeys,
  });

  const { merged, entry: bridgeLink } = useBridgeUIComponent<
    LinkMerged<T>,
    "Link"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Link",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["slots", "children"]);
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LinkClasses>({
    entry: bridgeLink,
    props: componentProps,
  });

  const rootTag = derived(() => {
    if (merged.disabled || merged.linkAs == null) {
      return "a";
    }

    return merged.linkAs;
  });

  const rootAriaDisabled = derived(() => {
    return merged.disabled ? true : undefined;
  });

  const rootHref = derived(() => {
    return merged.disabled ? undefined : merged.href;
  });

  const rootTarget = derived(() => {
    if (merged.external && !merged.disabled) {
      return "_blank" as const;
    }

    return undefined;
  });

  const rootRel = derived(() => {
    if (merged.external && !merged.disabled) {
      return "noopener noreferrer";
    }

    return undefined;
  });

  const sizeClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeLink?.tokens?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeLink?.tokens?.size]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeLink?.tokens?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeLink?.tokens?.color]);

  const underlineClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      underlineProps,
      bridgeLink?.tokens?.underline,
    );

    return get(classes, merged.underline);
  }, [merged.underline, bridgeLink?.tokens?.underline]);

  const rootBind = derived(() => {
    return mergePartBind(
      customProps?.root,
      {
        ...rootInheritedAttrs,
        ...resolveLinkAsProps(merged.linkAs, merged.linkProps, rootTag),
      },
      cn({
        "inline-flex items-center gap-x-1 font-medium": true,
        "transition-colors duration-200": true,
        [sizeClass ?? ""]: true,
        [underlineClass ?? ""]: true,
        [get(colorClass, "base") ?? ""]: true,
        [get(colorClass, "hover") ?? ""]: true,
        "aria-disabled:opacity-80 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none": true,
        [mergedClasses.root ?? ""]: true,
      }),
    );
  });

  const leftIconBind = derived(() => {
    return mergePartBind(
      customProps?.leftIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.leftIcon ?? ""]: true,
      }),
    );
  });

  const rightIconBind = derived(() => {
    return mergePartBind(
      customProps?.rightIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.rightIcon ?? ""]: true,
      }),
    );
  });

  return {
    slots,
    merged,
    rootRel,
    rootTag,
    children,
    rootBind,
    rootHref,
    rootTarget,
    leftIconBind,
    rightIconBind,
    rootAriaDisabled,
  };
}
