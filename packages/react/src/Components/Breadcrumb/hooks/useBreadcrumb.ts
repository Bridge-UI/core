// ** External Imports
import { get, omit } from "es-toolkit/compat";
import { useMemo } from "react";

// ** Core Imports
import { collapseBreadcrumbItems } from "@bridge-ui/core/Domain";
import { breadcrumbSizeProps as sizeProps } from "@bridge-ui/core/Tokens";
import {
  cn,
  mergeBridgeUILayeredClasses,
  splitComponentProps,
  type LibDefaultsShape,
  type MergeLibDefaults,
} from "@bridge-ui/core/Utils";

// ** Local Imports
import type { BreadcrumbContextValue } from "@/Components/Breadcrumb/BreadcrumbContext";
import type {
  BreadcrumbOwnProps,
  BreadcrumbProps,
} from "@/Components/Breadcrumb/breadcrumb.types";
import {
  derived,
  mergePartBind,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const breadcrumbBridgeKeys = [
  "size",
  "items",
  "slots",
  "classes",
  "maxItems",
  "separator",
  "customProps",
] as const satisfies readonly (keyof BreadcrumbOwnProps)[];

type BreadcrumbLibDefaults = LibDefaultsShape<
  BreadcrumbOwnProps,
  "size" | "separator"
>;

type BreadcrumbMerged = MergeLibDefaults<
  BreadcrumbOwnProps,
  BreadcrumbLibDefaults
>;

export function useBreadcrumb(
  props: BreadcrumbProps,
  libDefaults: BreadcrumbLibDefaults,
) {
  const { componentProps, inheritedAttrs } = splitComponentProps<
    BreadcrumbProps,
    typeof breadcrumbBridgeKeys
  >({
    props,
    bridgeKeys: breadcrumbBridgeKeys,
  });

  const { merged, entry: bridgeBreadcrumb } = useBridgeUIComponent<
    BreadcrumbMerged,
    "Breadcrumb"
  >({
    libDefaults,
    props: componentProps,
    componentName: "Breadcrumb",
  });

  const children = derived(() => {
    return props.children;
  });

  const customProps = derived(() => {
    return merged.customProps;
  });

  const slots = derived(() => {
    return props.slots;
  });

  const rootInheritedAttrs = derived(() => {
    return omit(inheritedAttrs, ["children", "slots"]);
  });

  const collapsedItems = derived(() => {
    return collapseBreadcrumbItems(merged.items ?? [], merged.maxItems);
  });

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: componentProps,
    entry: bridgeBreadcrumb,
  });

  const sizeClasses = useMemo(() => {
    return mergeBridgeUILayeredClasses(
      sizeProps,
      bridgeBreadcrumb?.tokens?.size,
    );
  }, [bridgeBreadcrumb?.tokens?.size]);

  const sizeItem = derived(() => {
    return get(sizeClasses, merged.size);
  });

  const contextValue = useMemo((): BreadcrumbContextValue => {
    return {
      separator: merged.separator,
      separatorSlot: slots?.separator,
      separatorIconProps: customProps?.separator,
      separatorClass: get(mergedClasses, "separator"),
      tokenClasses: {
        item: get(sizeItem, "item"),
        link: get(sizeItem, "link"),
        iconSize: get(sizeItem, "icon"),
        current: get(sizeItem, "current"),
        separator: get(sizeItem, "separator"),
      },
    };
  }, [
    customProps?.separator,
    merged.separator,
    mergedClasses,
    sizeItem,
    slots,
  ]);

  const rootBind = derived(() => {
    return mergePartBind(customProps?.root, rootInheritedAttrs, {
      "aria-label":
        (rootInheritedAttrs as { "aria-label"?: string })["aria-label"] ??
        "Breadcrumb",
      className: cn({
        [get(sizeItem, "root") ?? ""]: true,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const listBind = derived(() => {
    return mergePartBind(
      customProps?.list,
      {},
      {
        role: "list",
        className: cn({
          [get(sizeItem, "list") ?? ""]: true,
          [get(mergedClasses, "list") ?? ""]: true,
          "[&>li:first-child_[data-slot=separator]]:hidden": true,
        }),
      },
    );
  });

  return {
    merged,
    children,
    rootBind,
    listBind,
    contextValue,
    collapsedItems,
  };
}
