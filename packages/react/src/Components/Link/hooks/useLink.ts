// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core";
import {
  colorProps,
  sizeProps,
  underlineProps,
} from "@bridge-ui/core/Components/Link";

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

type LinkLibDefaults = LibDefaultsShape<
  LinkOwnProps,
  "color" | "size" | "underline"
>;

type LinkMerged = MergeLibDefaults<LinkOwnProps, LinkLibDefaults>;

export function useLink(props: LinkProps, libDefaults: LinkLibDefaults) {
  const { customProps, inheritedAttrs } = splitComponentProps<
    LinkProps,
    typeof linkBridgeKeys
  >({
    props,
    bridgeKeys: linkBridgeKeys,
  });

  const { merged, entry: bridgeLink } = useBridgeUIComponent<
    LinkMerged,
    "Link"
  >({
    libDefaults,
    props: customProps,
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

  const partsProps = derived(() => {
    return merged.partsProps;
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses<LinkClasses>({
    entry: bridgeLink,
    props: customProps,
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
      bridgeLink?.customProps?.size,
    );

    return get(classes, merged.size);
  }, [merged.size, bridgeLink?.customProps?.size]);

  const colorClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      colorProps,
      bridgeLink?.customProps?.color,
    );

    return get(classes, merged.color);
  }, [merged.color, bridgeLink?.customProps?.color]);

  const underlineClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      underlineProps,
      bridgeLink?.customProps?.underline,
    );

    return get(classes, merged.underline);
  }, [merged.underline, bridgeLink?.customProps?.underline]);

  const rootBind = derived(() => {
    return mergePartBind(
      partsProps?.root,
      rootInheritedAttrs,
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
      partsProps?.leftIcon,
      {},
      cn({
        "shrink-0": true,
        [mergedClasses.leftIcon ?? ""]: true,
      }),
    );
  });

  const rightIconBind = derived(() => {
    return mergePartBind(
      partsProps?.rightIcon,
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
    children,
    rootBind,
    rootHref,
    rootTarget,
    leftIconBind,
    rightIconBind,
    rootAriaDisabled,
  };
}
