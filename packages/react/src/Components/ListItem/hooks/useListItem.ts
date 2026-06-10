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
import { alignProps } from "@bridge-ui/core/Components/ListItem";

// ** Local Imports
import { useListContext } from "@/Components/List/ListContext";
import type {
  ListItemOwnProps,
  ListItemProps,
} from "@/Components/ListItem/listItem.types";
import {
  derived,
  hasSlotOrProp,
  isPropPresent,
  mergePartBind,
  resolveSlotOrProp,
  useBridgeUIComponent,
  useBridgeUIMergedRegistryClasses,
} from "@/Utils";

const listItemBridgeKeys = [
  "as",
  "role",
  "align",
  "dense",
  "slots",
  "primary",
  "classes",
  "divider",
  "disabled",
  "selected",
  "secondary",
  "partsProps",
  "interactive",
] as const satisfies readonly (keyof ListItemOwnProps)[];

type ListItemLibDefaults = LibDefaultsShape<ListItemOwnProps, "align" | "role">;

type ListItemMerged = MergeLibDefaults<ListItemOwnProps, ListItemLibDefaults>;

export function useListItem(
  props: ListItemProps,
  libDefaults: ListItemLibDefaults,
) {
  const listContext = useListContext();

  const { customProps, inheritedAttrs } = splitComponentProps<
    ListItemProps,
    typeof listItemBridgeKeys
  >({
    props,
    bridgeKeys: listItemBridgeKeys,
  });

  const { merged, entry: bridgeListItem } = useBridgeUIComponent<
    ListItemMerged,
    "ListItem"
  >({
    libDefaults,
    props: customProps,
    componentName: "ListItem",
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

  const mergedClasses = useBridgeUIMergedRegistryClasses({
    props: customProps,
    entry: bridgeListItem,
  });

  const isDense = derived(() => {
    return merged.dense ?? listContext?.dense ?? false;
  });

  const alignClass = useMemo(() => {
    const classes = mergeBridgeUILayeredClasses(
      alignProps,
      bridgeListItem?.customProps?.align,
    );

    return get(classes, merged.align);
  }, [merged.align, bridgeListItem?.customProps?.align]);

  const hasPrimary = derived(() => {
    return (
      hasSlotOrProp(slots, "primary", merged.primary) || isPropPresent(children)
    );
  });

  const hasSecondary = derived(() => {
    return hasSlotOrProp(slots, "secondary", merged.secondary);
  });

  const hasStart = derived(() => {
    return Boolean(slots?.start);
  });

  const hasEnd = derived(() => {
    return Boolean(slots?.end);
  });

  const rootBind = derived(() => {
    return mergePartBind(partsProps?.root, rootInheritedAttrs, {
      className: cn({
        "list-none": true,
        "border-b border-black/10 last:border-b-0": merged.divider,
        [get(mergedClasses, "root") ?? ""]: true,
      }),
    });
  });

  const interactiveBind = derived(() => {
    if (!merged.interactive) {
      return null;
    }

    return mergePartBind(
      partsProps?.interactive,
      {},
      {
        role: merged.role,
        tabIndex: merged.disabled ? -1 : 0,
        "aria-disabled": merged.disabled ? true : undefined,
        "data-selected": merged.selected ? true : undefined,
        className: cn({
          "flex w-full min-w-0 gap-x-3 text-left outline-hidden transition-colors": true,
          "cursor-pointer select-none": !merged.disabled,
          "px-4": true,
          "py-2": !isDense,
          "py-1.5": isDense,
          "hover:bg-black/5 focus-visible:bg-black/5": !merged.disabled,
          "bg-primary-50 text-primary-700": merged.selected,
          "opacity-50 pointer-events-none": merged.disabled,
          [alignClass ?? ""]: true,
          [get(mergedClasses, "interactive") ?? ""]: true,
        }),
      },
    );
  });

  const rowClassName = derived(() => {
    return cn({
      "flex w-full min-w-0 gap-x-3": true,
      "px-4": !merged.interactive,
      "py-2": !merged.interactive && !isDense,
      "py-1.5": !merged.interactive && isDense,
      [alignClass ?? ""]: !merged.interactive,
    });
  });

  const startBind = derived(() => {
    return mergePartBind(
      partsProps?.start,
      {},
      {
        className: cn({
          "flex shrink-0": true,
          [get(mergedClasses, "start") ?? ""]: true,
        }),
      },
    );
  });

  const contentBind = derived(() => {
    return mergePartBind(
      partsProps?.content,
      {},
      {
        className: cn({
          "min-w-0 flex-1": true,
          [get(mergedClasses, "content") ?? ""]: true,
        }),
      },
    );
  });

  const primaryBind = derived(() => {
    return mergePartBind(
      partsProps?.primary,
      {},
      {
        className: cn({
          "block truncate text-sm font-medium": true,
          [get(mergedClasses, "primary") ?? ""]: true,
        }),
      },
    );
  });

  const secondaryBind = derived(() => {
    return mergePartBind(
      partsProps?.secondary,
      {},
      {
        className: cn({
          "mt-0.5 block truncate text-xs text-dark-500": true,
          [get(mergedClasses, "secondary") ?? ""]: true,
        }),
      },
    );
  });

  const endBind = derived(() => {
    return mergePartBind(
      partsProps?.end,
      {},
      {
        className: cn({
          "ml-auto flex shrink-0 items-center": true,
          [get(mergedClasses, "end") ?? ""]: true,
        }),
      },
    );
  });

  const primaryContent = derived(() => {
    return resolveSlotOrProp({
      slots,
      name: "primary",
      fallback: merged.primary ?? children,
    });
  });

  const secondaryContent = derived(() => {
    return resolveSlotOrProp({
      slots,
      name: "secondary",
      fallback: merged.secondary,
    });
  });

  return {
    slots,
    merged,
    hasEnd,
    endBind,
    rootBind,
    hasStart,
    startBind,
    hasPrimary,
    contentBind,
    primaryBind,
    rowClassName,
    hasSecondary,
    secondaryBind,
    primaryContent,
    interactiveBind,
    secondaryContent,
  };
}
