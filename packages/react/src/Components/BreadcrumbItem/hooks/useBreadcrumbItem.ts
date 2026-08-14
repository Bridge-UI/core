// ** External Imports
import { get, omit, pick } from "es-toolkit/compat";

// ** Core Imports
import type { IconSize } from "@bridge-ui/core/Tokens/Icon";
import { cn, splitComponentProps } from "@bridge-ui/core/Utils";

// ** Local Imports
import { useBreadcrumbContext } from "@/Components/Breadcrumb/BreadcrumbContext";
import type {
  BreadcrumbItemOwnProps,
  BreadcrumbItemProps,
} from "@/Components/BreadcrumbItem/breadcrumbItem.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const breadcrumbItemBridgeKeys = [
  "as",
  "href",
  "slots",
  "classes",
  "current",
  "endIcon",
  "disabled",
  "startIcon",
  "customProps",
] as const satisfies readonly (keyof BreadcrumbItemOwnProps)[];

export function useBreadcrumbItem(props: BreadcrumbItemProps) {
  const breadcrumb = useBreadcrumbContext();

  const { componentProps, inheritedAttrs } = splitComponentProps<
    BreadcrumbItemProps,
    typeof breadcrumbItemBridgeKeys
  >({
    props,
    bridgeKeys: breadcrumbItemBridgeKeys,
  });

  const { merged, entry: bridgeBreadcrumbItem } = useBridgeUIComponent<
    BreadcrumbItemOwnProps,
    "BreadcrumbItem"
  >({
    props: componentProps,
    componentName: "BreadcrumbItem",
  });

  const slots = derived(() => {
    return props.slots;
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const current = derived(() => {
    return merged.current === true;
  });

  const disabled = derived(() => {
    return merged.disabled === true;
  });

  const iconSize = derived(() => {
    return (breadcrumb.tokenClasses.iconSize ?? "md") as keyof IconSize;
  });

  const crumbAs = derived(() => {
    if (current || disabled) {
      return "span" as const;
    }

    if (merged.as) {
      return merged.as;
    }

    return merged.href != null ? ("a" as const) : ("span" as const);
  });

  const linkInheritedAttrs = derived(() => {
    return pick(inheritedAttrs, ["aria-label", "aria-labelledby"]);
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, [
      "slots",
      "children",
      "aria-label",
      "aria-labelledby",
    ]);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeBreadcrumbItem,
  });

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      className: cn({
        [breadcrumb.tokenClasses.item ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const separatorBind = derived(() => {
    return mergePartBind(
      {},
      {},
      {
        "aria-hidden": true,
        "data-slot": "separator",
        className: cn({
          [breadcrumb.tokenClasses.separator ?? ""]: true,
          [breadcrumb.separatorClass ?? ""]: true,
          [get(mergedClasses, "separator") ?? ""]: true,
        }),
      },
    );
  });

  const separatorIconBind = derived(() => {
    return mergePartBind(
      customProps?.separator ?? breadcrumb.separatorIconProps,
      {},
      {
        size: iconSize,
        className: cn({
          "shrink-0": true,
        }),
      },
    );
  });

  const linkBind = derived(() => {
    const isCurrent = current;
    const partProps = isCurrent ? customProps?.current : customProps?.link;

    return mergePartBind(partProps, linkInheritedAttrs, {
      "aria-disabled": disabled || undefined,
      href: !isCurrent && !disabled ? merged.href : undefined,
      "aria-current": isCurrent ? ("page" as const) : undefined,
      className: cn({
        [isCurrent
          ? (breadcrumb.tokenClasses.current ?? "")
          : (breadcrumb.tokenClasses.link ?? "")]: true,
        [get(mergedClasses, isCurrent ? "current" : "link") ?? ""]: true,
        "pointer-events-none opacity-50": disabled && !isCurrent,
      }),
    });
  });

  const startIconBind = derived(() => {
    return mergePartBind(
      customProps?.startIcon,
      {},
      {
        size: iconSize,
        className: cn({
          "shrink-0": true,
          [get(mergedClasses, "startIcon") ?? ""]: true,
        }),
      },
    );
  });

  const endIconBind = derived(() => {
    return mergePartBind(
      customProps?.endIcon,
      {},
      {
        size: iconSize,
        className: cn({
          "shrink-0": true,
          [get(mergedClasses, "endIcon") ?? ""]: true,
        }),
      },
    );
  });

  const separatorContent = derived(() => {
    return slots?.separator ?? breadcrumb.separatorSlot;
  });

  const separatorIcon = derived(() => {
    return breadcrumb.separator;
  });

  return {
    slots,
    merged,
    crumbAs,
    children,
    rootBind,
    linkBind,
    endIconBind,
    startIconBind,
    separatorBind,
    separatorIcon,
    separatorContent,
    separatorIconBind,
  };
}
